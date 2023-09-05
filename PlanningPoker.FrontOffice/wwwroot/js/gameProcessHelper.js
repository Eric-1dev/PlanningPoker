/*jshint esversion: 6 */

$(document).ready(() => {
    gameProcessHelper.init();
});

let gameProcessHelper = {
    init: () => {
        gameProcessHelper.gameId = $('#planning-poker-game-id').val();

        gameProcessHelper._addClickEventToCards();

        gameProcessHelper._subTaskZone = $('#planning-poker-tasks-zone');

        hubConnectorHelper.init();
    },

    gameId: '',

    addPlayer: (user) => {
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
        if (gameInfo.taskName) {
            gameProcessHelper.handleTaskName(gameInfo.taskName);
        }

        if (gameInfo.cards && gameInfo.cards.length > 0) {
            gameProcessHelper.handleCardsInfo(gameInfo.cards);
        }

        if (gameInfo.subTasks) {
            gameProcessHelper.handleSubTasksInfo(gameInfo.subTasks, gameInfo.isAdmin, gameInfo.availableScores);
        }

        if (gameInfo.otherUsers) {
            gameInfo.otherUsers.forEach((user) => {
                if (user.isPlayer) {
                    gameProcessHelper.addPlayer(user);
                }
            });
        }
    },

    handleCardsInfo: (cards) => {
        let cardZone = $('#planning-poker-gamer-card-zone');

        cardZone.html('');

        cards.forEach((card) => {
            let cardBlock = $(`<div class="planning-poker-card planning-poker-card-clickable ${gameProcessHelper._mapCardColorToClass(card.color)}" score="${card.score}">`);
            cardBlock.html(card.text);

            cardZone.append(cardBlock);
        });

        gameProcessHelper._addClickEventToCards();
    },

    handleSubTasksInfo: (subTasks, isAdmin, scoreValues) => {
        subTasks.sort((a, b) => a.order - b.order).forEach((subTask) => {
            gameProcessHelper.handleSubTaskInfo(subTask, isAdmin, scoreValues);
        });
    },

    handleSubTaskInfo: (subTask, isAdmin, scoreValues) => {
        let isActive;

        if (subTask.isSelected) {
            isActive = "true";
        } else {
            isActive = "false";
        }

        let taskBlock = $(`<div class="planning-poker-tasks-zone-task" active="${isActive}" task-id="${subTask.id}">`);
        let taskNameBlock = $(`<div class="planning-poker-tasks-zone-task-name">${subTask.text}</div>`);

        let scoreBlock;

        if (isAdmin && subTask.isSelected) {
            scoreBlock = $('<select class="form-select shadow-none planning-poker-tasks-zone-task-score">');

            scoreBlock.append($('<option value="">'));

            scoreValues.forEach((scoreValue) => {

                let selectedAttr;
                if (scoreValue === subTask.score) {
                    selectedAttr = 'selected';
                }

                let option = $(`<option ${selectedAttr} value="${scoreValue}">`);
                option.html(scoreValue);

                scoreBlock.append(option);
            });

        } else {
            scoreBlock = $('<div class="planning-poker-tasks-zone-task-score">');
            scoreBlock.html(subTask.score);
        }

        scoreBlock.change((event) => gameProcessHelper.onSubTaskScoreChanged(event.target));

        taskBlock.append(taskNameBlock);
        taskBlock.append(scoreBlock);

        let existingTask = gameProcessHelper._findSubTaskById(subTask.id);

        if (existingTask.length === 1) {
            existingTask.after(taskBlock);
            existingTask.remove();
        } else {
            gameProcessHelper._subTaskZone.append(taskBlock);
        }
    },

    handleTaskName: (taskName) => {
        $('#planning-poker-tasks-zone-task-header').html(taskName);
    },

    handleSubTaskChangeScore: (subTaskId, score) => {
        let subTask = gameProcessHelper._findSubTaskById(subTaskId);

        let scoreBlock = subTask.find('.planning-poker-tasks-zone-task-score');

        scoreBlock.html(score);
    },

    onSubTaskScoreChanged: (target) => {
        let subTaskId = $(target).closest('.planning-poker-tasks-zone-task').attr('task-id');
        let scoreStr = $(target).val();

        let score;

        if (scoreStr) {
            score = parseFloat(scoreStr);
        } else {
            score = null;
        }

        hubConnectorHelper.invokeChangeSubTaskScore(subTaskId, score);
    },

    _subTaskZone: {},
    _lastClickedCard: {},

    _findUserCardByUserId: (userId) => {
        return $(`.planning-poker-gamer-score[user-id="${userId}"]`);
    },

    _findSubTaskById: (subTaskId) => {
        return gameProcessHelper._subTaskZone.find(`.planning-poker-tasks-zone-task[task-id="${subTaskId}"]`);
    },

    _addClickEventToCards: () => {
        $('.planning-poker-card-clickable').click((event) => {
            let selectedCard = $(event.target);

            let wasSelected = selectedCard.hasClass('planning-poker-card-selected');

            let score;

            if (wasSelected) {
                score = null;
            } else {
                let scoreStr = selectedCard.attr('score');
                score = parseFloat(scoreStr);
            }

            hubConnectorHelper.invokeTryChangeVote(score);

            gameProcessHelper._lastClickedCard = selectedCard;
        });
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
