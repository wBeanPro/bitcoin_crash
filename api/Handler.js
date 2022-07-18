'use strict';

var Auth   = require("./Game/Auth");
var Chat   = require("./Game/Chat");
var Game   = require("./Game/Game");
var Wallet = require("./Game/Wallet");
var Bot    = require("./Game/Bot");
var fakeData = require("./Fake");

//Lock For Repeat Bot
let Lock = false;

module.exports = function(data, socket, io, crypter){
    console.log('Getting Data: ');
    console.log(data);

    const {
        handleEdit,
        handleUserInfo,
        handleUserChart,
        getAllUsers,
        getAllBots,
        addFriend,
        sendTip,
        deleteTargetUser,
        changeTargetCash,
        changeMuting,
        disableBot
    } = Auth(socket, crypter);

    const {
        hadleSubmitChat,
        hadleSubmitBotChat,
        hadleSubmitCommand
    } = Chat(socket, io, crypter);

    const {
        saveUserDeposit,
        getWithdrawls,
        getUserBits
    } = Wallet(socket, crypter);

    const {
        registerBot
    } = Bot(socket, crypter);

    const {
        RefHistory
    } = require("./Game/Refferal")(socket, crypter);

    const {
        newWithdrawal
    } = require("./Game/Wallet/MakeWithdrawl")(socket, crypter);

    const {
        makeWallet
    } = require("./Game/Wallet/MakeWallet")(socket, crypter);

    const {
        depositHistory
    } = require("./Game/Wallet/DepositHistory")(socket, crypter);

    const {
        handleGameDetails
    } = Game(socket, crypter);

    //Chats Bot
    function setupChatBot(io) {
        const bots = fakeData();
        bots.forEach((data, i) => {
            hadleSubmitBotChat(data.uid, data.name, data.message, 'us');
        });
        autoUpdateBots(0, io);
    }

    function autoUpdateBots(counter, io) {
        if(Lock) return;
        Lock = true;
        var interval = setInterval(function() {
            counter++;
            if (counter === 40) {
                setupChatBot(io);
                clearInterval(interval);
            }
        }, 1000);
    }

    // autoUpdateBots(0, io);

    switch(data.command)
    {
        case "fake_chat":
            hadleSubmitBotChat(data.name, data.message, data.room);
            break;

        case "chat":
            hadleSubmitChat(data.uid, data.message, data.room);
            break;

        case "command_chat":
            hadleSubmitCommand(data.message, data.room);
            break;

        case "make_wallet":
            makeWallet(data.uid);
            break;

        case "submit_new_withdrawl":
            newWithdrawal(data.uid, data.wallet, data.amount, data.immed, data.password);
            break;

        case "withdrawl_history":
            getWithdrawls(data.uid);
            break;

        case "ref_history":
            RefHistory(data.uid);
            break;

        case 'deposit_history':
            depositHistory(data.uid);
            break;

        case 'new_deposit':
            saveUserDeposit(data.uid, data.amount);
            break;

        case "get_bits":
            getUserBits(data.uid);
            break;

        case "edit_account":
            handleEdit(data.id, data.email, data.password);
            break;

        case "game_details":
            handleGameDetails(data.uid, data.id);
            break;

        case "user_info":
            handleUserInfo(data.name);
            break;

        case "user_chart":
            handleUserChart(data.id, data.page);
            break;

        case "add_friend":
            addFriend(data.uid, data.name);
            break;

        case "send_tip":
            sendTip(data.uid, data.target, data.amount);
            break;

        case "all_users":
            getAllUsers(data.page);
            break;

        case "all_bots":
            getAllBots(data.page);
            break;

        case "delete_user":
            deleteTargetUser(data.target);
            break;

        case "edit_balance":
            changeTargetCash(data.target, data.cash);
            break;

        case "mute_user":
            changeMuting(data.id);
            break;

        case "disable_bot":
            disableBot(data.id);
            break;

        case "bot_register":
            registerBot(data.name, data.min, data.max, data.cmax, data.cmin);
            break;
    }
};