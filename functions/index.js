const functions = require('firebase-functions');
const moment = require('moment');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.database();
const convertCurrency = (fromCurr, toCurr, money) => {
    if (fromCurr === toCurr) return money;
    return 0;
};

exports.updateAccountOnRecordAddition = functions.database.ref('records/{userId}/{recordId}')
    .onCreate(event => {
        const newRecord = event.data.val();
        if (newRecord.planning) return;

        const { userId } = event.params;
        const accountRef = db.ref(`accounts/${userId}`).child(newRecord.account);

        return accountRef.once('value', snapshot => {
            const account = snapshot.val();
            if (account) {
                const accountMoney = parseFloat(account.money);
                const recordMoney = convertCurrency(
                    newRecord.currency, account.currency, parseFloat(newRecord.money));
                account.money = accountMoney + 
                    (newRecord.type === 'income' ? recordMoney : -recordMoney);
                accountRef.update(account);
            }
        });
});

exports.updateAccountOnRecordDeletion = functions.database.ref('records/{userId}/{recordId}')
    .onDelete(event => {
        const deletedRecord = event.data.previous.val();
        if (deletedRecord.planning) return;

        const { userId } = event.params;
        const accountRef = db.ref(`accounts/${userId}`).child(deletedRecord.account);

        return accountRef.once('value', snapshot => {
            const account = snapshot.val();
            if (account) {
                const accountMoney = parseFloat(account.money);
                const recordMoney = convertCurrency(
                    deletedRecord.currency, account.currency, parseFloat(deletedRecord.money));
                account.money = accountMoney +
                    (deletedRecord.type === 'income' ? -recordMoney : recordMoney);
                accountRef.update(account);
            }
        });
});

exports.updateAccountOnRecordUpdating = functions.database.ref('records/{userId}/{recordId}')
    .onUpdate(event => {
        const updatedRecord = event.data.val();
        if (updatedRecord.planning) return;

        const oldRecord = event.data.previous.val();
        const { userId } = event.params;
        const oldAccountRef = db.ref(`accounts/${userId}`).child(oldRecord.account);
        const updatedAccountRef = oldRecord.account === updatedRecord.account ? null :
            db.ref(`accounts/${userId}`).child(updatedRecord.account);

        oldAccountRef.once('value', snapshot => {
            const oldAccount = snapshot.val();
            if (oldAccount) {
                const oldAccountMoney = parseFloat(oldAccount.money);
                const oldRecordMoney = convertCurrency(
                    oldRecord.currency, oldAccount.currency, parseFloat(oldRecord.money));
                const updatedRecordMoney = convertCurrency(
                    updatedRecord.currency, oldAccount.currency, parseFloat(updatedRecord.money));
                
                if (oldRecordMoney !== updatedRecordMoney) {
                    oldAccount.money = oldAccountMoney +
                        (oldRecord.type === 'income' ? -oldRecordMoney : oldRecordMoney) + 
                        (updatedAccountRef ? 0 : 
                            (updatedRecord.type === 'income' ? updatedRecordMoney : -updatedRecordMoney));
                    oldAccountRef.update(oldAccount);
                }
            }

            if (updatedAccountRef) {
                updatedAccountRef.once('value', s => {
                    updatedAccount = s.val();
                    if (updatedAccount) {
                        const updatedAccountMoney = parseFloat(updatedAccount.money);
                        const updRecordMoney = convertCurrency(
                            updatedRecord.currency, oldAccount.currency, parseFloat(updatedRecord.money));
                        
                            updatedAccount.money = updatedAccountMoney + 
                                (updatedRecord.type === 'income' ? updRecordMoney : -updRecordMoney);
                            updatedAccountRef.update(updatedAccount);
                    }
                });
            }
        });
});

exports.removeRelatedRecords = functions.database.ref('accounts/{userId}/{accountId}')
    .onDelete(event => {
        const updatedAccount = event.data.val();
        const { userId, accountId } = event.params;
        const recordsRef = db.ref('records').child(userId);

        return recordsRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.val().account === accountId) {
                    recordsRef.child(childSnapshot.key).remove();
                }
            });
        });
});

exports.updateRecordsOnAccountUpdate = functions.database.ref('accounts/{userId}/{accountId}')
    .onUpdate(event => {
        const updatedAccount = event.data.val();
        const { userId, accountId } = event.params;
        const recordsRef = db.ref('records').child(userId);

        return recordsRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                const record = childSnapshot.val();
                if (record.account === accountId) {
                    const updatedRecord = Object.assign(record, {
                        displayAccount: updatedAccount.title
                    });

                    recordsRef.child(childSnapshot.key).update(updatedRecord);
                }
            });
        });
});

exports.performPlanning = functions.https.onRequest((req, res) => {
    const recordsRef = db.ref('records');
    const accountsRef = db.ref('accounts');
    const applyPlanning = recordSnapshot => {
        const record = recordSnapshot.val();
        if (moment(record.date) <= moment() && record.planning) {
            accountsRef.child(userRecordsSnapshot.key).child(record.account).once('value', s => {
                const account = s.val();
                if (account) {
                    const accountMoney = parseFloat(account.money);
                    const recordMoney = convertCurrency(
                        record.currency, account.currency, parseFloat(record.money));
                    account.money = accountMoney + 
                        (record.type === 'income' ? recordMoney : -recordMoney);

                    accountsRef.child(userRecordsSnapshot.key).child(record.account).update(account);

                    record.planning = false;
                    recordsRef.child(userRecordsSnapshot.key).child(recordSnapshot.key).update(record);
                }
            });
        }
    };

    recordsRef.once('value', snapshot => {
        snapshot.forEach(userRecordsSnapshot => 
            userRecordsSnapshot.forEach(applyPlanning));
        res.end();
    });
});
