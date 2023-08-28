$(document).ready(() => {
    gameProcessHelper.init();
});

let gameProcessHelper = {
    init: () => {
        $('.planning-poker-card-clickable').click((event) => {
            let selectedCard = $(event.target);

            let wasSelected = selectedCard.hasClass('planning-poker-card-selected');

            $('.planning-poker-card-selected').removeClass('planning-poker-card-selected');

            if (!wasSelected) {
                selectedCard.addClass('planning-poker-card-selected');
            }
        });
    }
};
