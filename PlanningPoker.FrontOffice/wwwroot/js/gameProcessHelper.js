/*jshint esversion: 6 */

$(document).ready(() => {
    gameProcessHelper.init();
});

let gameProcessHelper = {
    init: () => {
        gameProcessHelper.gameId = $('#planning-poker-game-id').val();

        $('.planning-poker-card-clickable').click((event) => {
            let selectedCard = $(event.target);

            let wasSelected = selectedCard.hasClass('planning-poker-card-selected');

            let hasVote = !wasSelected;

            hubConnectorHelper.invokeTryChangeVote(hasVote);

            gameProcessHelper._lastClickedCard = selectedCard;
        });

        hubConnectorHelper.init();
    },

    gameId: '',

    addUser: (user) => {
        let existingUserCard = gameProcessHelper._findUserCardByUserId(user.id);
        if (existingUserCard.length > 0) {
            return;
        }

        let scoreBlock = $('<div class="planning-poker-gamer-score">');
        scoreBlock.attr('user-id', user.id);

        let cardState;
        if (user.hasVoted) {
            cardState = 'voted-closed';
        } else {
            cardState = 'unvoted';
        }

        let card = $(`<div class="planning-poker-card" card-state="${cardState}">`);
        let userNameBlock = $('<div class="planning-poker-gamer-name">');
        userNameBlock.html(user.name);

        scoreBlock.append(card);
        scoreBlock.append(userNameBlock);

        $('.planning-poker-gamers-zone').append(scoreBlock);
    },

    removeUser: (userId) => {
        let existingUserCard = gameProcessHelper._findUserCardByUserId(userId);
        if (existingUserCard.length < 1) {
            return;
        }

        existingUserCard.remove();
    },

    updateUserVote: (user) => {
        let userCard = gameProcessHelper._findUserCardByUserId(user.id);
        if (userCard.length === 0) {
            return;
        }

        if (user.hasVoted) {
            userCard.find('.planning-poker-card').attr('card-state', 'voted-closed');
        } else {
            userCard.find('.planning-poker-card').attr('card-state', 'unvoted');
        }

        if (userCard.attr('mycard')) {
            $('.planning-poker-card-selected').removeClass('planning-poker-card-selected');

            if (user.hasVoted) {
                gameProcessHelper._lastClickedCard.addClass('planning-poker-card-selected');
            }
        }
    },

    handleGameInfoMessage: (gameInfo) => {
        if (gameInfo.cards && gameInfo.cards.length > 0) {
            gameProcessHelper.handleCardsInfo(gameInfo.cards);

            if (gameInfo.subTasks) {
                gameProcessHelper.handleSubTasksInfo(gameInfo.subTasks, gameInfo.cards, gameInfo.isAdmin);
            }
        }

        if (gameInfo.otherUsers) {
            gameInfo.otherUsers.forEach((user) => {
                gameProcessHelper.addUser(user);
            });
        }
    },

    handleCardsInfo: (cards) => {
        let cardZone = $('#planning-poker-gamer-card-zone')

        cardZone.html('');

        cards.forEach((card) => {
            let cardBlock = $(`<div class="planning-poker-card planning-poker-card-clickable ${gameProcessHelper._mapCardColorToClass(card.color)}" score="${card.score}">`)
            cardBlock.html(card.text);

            cardZone.append(cardBlock);
        });
    },

    handleSubTasksInfo: (subTasks, cards, isAdmin) => {
        let subTaskZone = $('#planning-poker-tasks-zone');

        subTasks.sort((a, b) => a.order - b.order).forEach((subTask) => {
            let taskBlock = $(`<div class="planning-poker-tasks-zone-task" task-id="${subTask.id}">`);
            let taskNameBlock = $(`<div class="planning-poker-tasks-zone-task-name">${subTask.text}</div>`);

            //todo заполнение задач

            taskBlock.append(taskNameBlock);
            subTaskZone.append(taskBlock);
        });
    },

    _lastClickedCard: {},

    _findUserCardByUserId: (userId) => {
        return $(`.planning-poker-gamer-score[user-id="${userId}"]`);
    },

    _mapCardColorToClass: (color) => {
        switch (color) {
            case 'Green':
                return 'planning-poker-card-color-green';
            case 'Yellow':
                return 'planning-poker-card-color-yellow';
            case 'Red':
                return 'planning-poker-card-color-red';
            case 'Gray':
                return 'planning-poker-card-color-gray';
            case 'Blue':
                return 'planning-poker-card-color-blue';
            default:
                return '';
        }
    }
};
