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

            $('.planning-poker-card-selected').removeClass('planning-poker-card-selected');

            if (!wasSelected) {
                selectedCard.addClass('planning-poker-card-selected');
            }
        });

        hubConnectorHelper.init();
    },

    gameId: '',

    renderUser: (userName, userId) => {
        let existingUser = $(`.planning-poker-gamer-score[id="${userId}"]`);
        if (existingUser.length > 0) {
            return;
        }

        let score = $('<div class="planning-poker-gamer-score">');
        score.prop('id', userId);
        let card = $('<div class="planning-poker-card planning-poker-card-color-gray">');
        let userNameBlock = $('<div class="planning-poker-gamer-name">');
        userNameBlock.html(userName);

        score.append(card);
        score.append(userNameBlock);

        $('.planning-poker-gamers-zone').append(score);
    }
};
