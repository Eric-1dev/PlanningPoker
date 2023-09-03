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

    _lastClickedCard: {},

    _findUserCardByUserId: (userId) => {
        return $(`.planning-poker-gamer-score[user-id="${userId}"]`);
    }

};
