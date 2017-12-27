const functions = require('firebase-functions');
const money = require('./money');
const moment = require('moment');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

money.base = 'USD';
money.rates = {
    'BYN': 2.009216,
    'RUB': 58.67696,
    'EUR': 0.841525,
    'USD': 1
};

const db = admin.database();
const convertCurrency = (fromCurr, toCurr, amount) => {
    if (fromCurr === toCurr) return amount;
    return +money(amount).from(fromCurr).to(toCurr).toFixed(2);
};

exports.updateAccountOnRecordAddition = functions.database.ref('records/{userId}/{recordId}')
    .onCreate(event => {
        const newRecord = event.data.val();
        if (newRecord.planning === 'true') return;

        const { userId, recordId } = event.params;
        const accountRef = db.ref(`accounts/${userId}`).child(newRecord.account);
        const recordRef = db.ref('records').child(userId).child(recordId);

        return accountRef.once('value', snapshot => {
            const account = snapshot.val();
            if (account) {
                const accountMoney = parseFloat(account.money);
                const recordMoney = convertCurrency(
                    newRecord.currency, account.currency, parseFloat(newRecord.money));
                account.money = +accountMoney + 
                    (newRecord.type === 'income' ? +recordMoney : -recordMoney);
                accountRef.update(account).then(() => {
                    const recordMoneyUSD = convertCurrency(
                        newRecord.currency, 'USD', parseFloat(newRecord.money));
                    newRecord.moneyUSD = '' + recordMoneyUSD;
                    recordRef.update(newRecord);
                });
            }
        });
});

exports.updateAccountOnRecordDeletion = functions.database.ref('records/{userId}/{recordId}')
    .onDelete(event => {
        const deletedRecord = event.data.previous.val();
        if (deletedRecord.planning === 'true') return;

        const { userId } = event.params;
        const accountRef = db.ref(`accounts/${userId}`).child(deletedRecord.account);

        return accountRef.once('value', snapshot => {
            const account = snapshot.val();
            if (account) {
                const accountMoney = parseFloat(account.money);
                const recordMoney = convertCurrency(
                    deletedRecord.currency, account.currency, parseFloat(deletedRecord.money));
                account.money = +accountMoney +
                    (deletedRecord.type === 'income' ? -recordMoney : +recordMoney);
                accountRef.update(account);
            }
        });
});

exports.updateAccountOnRecordUpdating = functions.database.ref('records/{userId}/{recordId}')
    .onUpdate(event => {
        const updatedRecord = event.data.val();
        if (updatedRecord.planning === 'true') return;

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
                    oldAccount.money = +oldAccountMoney +
                        (oldRecord.type === 'income' ? -oldRecordMoney : +oldRecordMoney) + 
                        (updatedAccountRef ? +0 : 
                            (updatedRecord.type === 'income' ? +updatedRecordMoney : -updatedRecordMoney));
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
                        
                            updatedAccount.money = +updatedAccountMoney + 
                                (updatedRecord.type === 'income' ? +updRecordMoney : -updRecordMoney);
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

    recordsRef.once('value', snapshot => {
        snapshot.forEach(userRecordsSnapshot => {
            const accountsToUpdate = {};

            userRecordsSnapshot.forEach(recordSnapshot => {
                const record = recordSnapshot.val();
                if (moment(record.date) <= moment() && record.planning) {
                    accountsToUpdate[record.account] = accountsToUpdate[record.account] || [];
                    accountsToUpdate[record.account].push({record, key: recordSnapshot.key});
                }
            });

            for (let accountID in accountsToUpdate) {
                accountsRef.child(userRecordsSnapshot.key).child(accountID).once('value', s => {
                    const account = s.val();
                    if (account) {
                        const accountMoney = parseFloat(account.money);

                        let moneyToUpdate = 0;
                        for (let recordSnap of accountsToUpdate[accountID]) {
                            const { record, key } = recordSnap;
                            const recordMoney = convertCurrency(
                                record.currency, account.currency, parseFloat(record.money));
                            moneyToUpdate += (record.type === 'income' ? +recordMoney : -recordMoney);

                            record.planning = false;
                            recordsRef.child(userRecordsSnapshot.key).child(key).update(record);
                        }

                        account.money = +accountMoney + +moneyToUpdate;
                        accountsRef.child(userRecordsSnapshot.key).child(accountID).update(account);
                    }
                });
            }
        });

        res.end();
    });
});

exports.addDefaultCategories = functions.auth.user().onCreate(event => {
    const user = event.data;
    const categoriesRef = db.ref('categories').child(user.uid);
    const defaultCategories = {
        'income': [
            'Salary', 'Deposit', 'Gifts', 'Winnings', 'Transfers', 'Other'
        ],
        'expenses': [
            'Shopping', 'Coffee', 'Dinner', 'Travel', 'Friends', 'Family',
            'Public service', 'Food', 'Education', 'Taxes', 'Sport',
            'Medicine', 'Clothes', 'Transport', 'Other'
        ]
    };

    for (let categoryType in defaultCategories) {
        defaultCategories[categoryType].forEach(category => {
            categoriesRef.child(categoryType).push(category);
        });
    }
});

exports.addUSDMoney = functions.database.ref('accounts/{userId}/{accountId}')
    .onCreate(event => {
        const newAccount = event.data.val();
        const { userId, accountId } = event.params;
        const accountRef = db.ref('accounts').child(userId).child(accountId);

        const accountMoneyUSD = convertCurrency(
            newAccount.currency, 'USD', parseFloat(newAccount.money));
        newAccount.moneyUSD = '' + accountMoneyUSD;
        accountRef.update(newAccount);
});
