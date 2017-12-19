const functions = require('firebase-functions');
const convertCurrency = (fromCurr, toCurr, money) => {
    if (fromCurr === toCurr) return money;
    return 0;
};

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.updateAccountOnRecordAddition = functions.database.ref('records/{userId}/{recordId}')
    .onCreate(event => {
        const newRecord = event.data.val();
        const { userId } = event.params;
        const accountRef = db.ref(`accounts/${userId}`).child(newRecord.account);

        return accountRef.once('value', snapshot => {
            const account = snapshot.val();
            if (account) {
                const accountMoney = parseInt(account.money);
                const recordMoney = convertCurrency(
                    newRecord.currency, account.currency, parseInt(newRecord.money));
                account.money = accountMoney + 
                    (newRecord.type === 'income' ? recordMoney : -recordMoney);
                accountRef.update(account);
            }
        });
});

exports.updateAccountOnRecordDeletion = functions.database.ref('records/{userId}/{recordId}')
    .onDelete(event => {
        const deletedRecord = event.data.previous.val();
        const { userId } = event.params;
        const accountRef = db.ref(`accounts/${userId}`).child(deletedRecord.account);

        return accountRef.once('value', snapshot => {
            const account = snapshot.val();
            if (account) {
                const accountMoney = parseInt(account.money);
                const recordMoney = convertCurrency(
                    deletedRecord.currency, account.currency, parseInt(deletedRecord.money));
                account.money = accountMoney +
                    (deletedRecord.type === 'income' ? -recordMoney : recordMoney);
                accountRef.update(account);
            }
        });
});

exports.updateAccountOnRecordUpdating = functions.database.ref('records/{userId}/{recordId}')
    .onUpdate(event => {
        const updatedRecord = event.data.val();
        const oldRecord = event.data.previous.val();
        const { userId } = event.params;
        const oldAccountRef = db.ref(`accounts/${userId}`).child(oldRecord.account);
        const updatedAccountRef = oldRecord.account === updatedRecord.account ? null :
            db.ref(`accounts/${userId}`).child(updatedRecord.account);

        oldAccountRef.once('value', snapshot => {
            const oldAccount = snapshot.val();
            if (oldAccount) {
                const oldAccountMoney = parseInt(oldAccount.money);
                const oldRecordMoney = convertCurrency(
                    oldRecord.currency, oldAccount.currency, parseInt(oldRecord.money));
                const updatedRecordMoney = convertCurrency(
                    updatedRecord.currency, oldAccount.currency, parseInt(updatedRecord.money));
                
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
                        const updatedAccountMoney = parseInt(updatedAccount.money);
                        const updRecordMoney = convertCurrency(
                            updatedRecord.currency, oldAccount.currency, parseInt(updatedRecord.money));
                        
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
                const record = Object.assign({
                    id: childSnapshot.key
                }, childSnapshot.val());

                if (record.account === accountId) {
                    const updatedRecord = Object.assign(record, {
                        displayAccount: updatedAccount.title
                    });

                    recordsRef.child(record.id).update(updatedRecord);
                }
            });
        });
});
