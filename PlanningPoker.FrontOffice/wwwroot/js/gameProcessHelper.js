/*jshint esversion: 6 */

$(document).ready(() => {
    gameProcessHelper.init();
});

let gameProcessHelper = {
    _subTaskZone: {},

    _isAdmin: false,
    _gameState: null,
    _lastClickedCard: null,
    _cards: null,
    _availableScores: null,

    gameId: '',

    init: () => {
        gameProcessHelper.gameId = $('#planning-poker-game-id').val();

        gameProcessHelper._addClickEventToCards();

        gameProcessHelper._subTaskZone = $('#planning-poker-tasks-zone');

        $('#planning-poker-spectate-button').click(() => {
            hubConnectorHelper.invokeSpectate();
        });

        $('#planning-poker-join-game-button').click(() => {
            hubConnectorHelper.invokeJoinGame();
        });

        $('#planning-poker-start-game-button').click(() => {
            if (gameProcessHelper._gameState !== 'Created') {
                return;
            }

            hubConnectorHelper.invokeStartGame();
        });

        $('#planning-poker-open-cards-button').click(() => {
            if (gameProcessHelper._gameState !== 'Scoring') {
                return;
            }

            hubConnectorHelper.invokeTryOpenCards();
        });

        $('#planning-poker-rescore-button').click(() => {
            if (gameProcessHelper._gameState !== 'CardsOpenned') {
                return;
            }

            hubConnectorHelper.invokeRescoreSubTask();
        });

        $('#planning-poker-score-next-button').click(() => {
            if (gameProcessHelper._gameState !== 'CardsOpenned') {
                return;
            }

            hubConnectorHelper.invokeScoreNextSubTask();
        });

        hubConnectorHelper.init();
    },

    onDisconnected: () => {
        $('#planning-poker-connection-lost-locker').fadeIn('fast');
    },

    onConnected: () => {
        $('#planning-poker-connection-lost-locker').fadeOut('fast');
    },

    handleNewMessage: (messageInfo) => {
        switch (messageInfo.messageType) {
            case 'Info':
                modalWindowHelper.showInfo(messageInfo.message);
                break;
            case 'Error':
                modalWindowHelper.showError(messageInfo.message);
                break;
            default:
                modalWindowHelper.showInfo(messageInfo.message);
                break;
        }
    },

    handleUserInfo: (user) => {
        let existingUserCard = gameProcessHelper._findUserCardByUserId(user.userId);

        if (!user.isPlayer) {
            existingUserCard.remove();
            return;
        }

        let scoreBlock = $('<div class="planning-poker-gamer-score">');
        scoreBlock.attr('user-id', user.userId);

        let cardInfo = gameProcessHelper._generateCardState(user);

        let card = $(`<div class="planning-poker-card" card-state="${cardInfo.cardState}">`);
        card.html(cardInfo.scoreText);

        let userNameBlock = $('<div class="planning-poker-gamer-name">');
        userNameBlock.html(user.name);

        scoreBlock.append(card);
        scoreBlock.append(userNameBlock);

        if (existingUserCard.length > 0) {
            existingUserCard.after(scoreBlock);
            existingUserCard.remove();
        } else {
            $('.planning-poker-gamers-zone').append(scoreBlock);
        }
    },

    removeUserCard: (userId) => {
        let existingUserCard = gameProcessHelper._findUserCardByUserId(userId);

        if (existingUserCard.length < 1) {
            return;
        }

        existingUserCard.remove();
    },

    updateUserVote: (user) => {
        let userCard = gameProcessHelper._findUserCardByUserId(user.userId);

        if (userCard.length === 0) {
            return;
        }

        let cardInfo = gameProcessHelper._generateCardState(user);

        userCard.find('.planning-poker-card').attr('card-state', cardInfo.cardState);
        userCard.find('.planning-poker-card').html(cardInfo.scoreText);

        if (userCard.attr('my-card')) {
            $('.planning-poker-card-selected').removeClass('planning-poker-card-selected');

            if (user.hasVoted) {
                if (gameProcessHelper._lastClickedCard !== null) {
                    gameProcessHelper._lastClickedCard.addClass('planning-poker-card-selected');
                    return;
                }

                if (user.score !== null) {
                    $(`.planning-poker-card-clickable[score="${user.score}"]`).addClass('planning-poker-card-selected');
                    return;
                }
            }
        }
    },

    handleGameInfoMessage: (gameInfo) => {
        gameProcessHelper._isAdmin = gameInfo.myInfo.userId === gameInfo.adminId;

        gameProcessHelper._cards = gameInfo.cards;

        gameProcessHelper._fillAvailableSubTaskScores();

        gameProcessHelper._gameState = gameInfo.gameState;

        gameProcessHelper.redrawCards();

        gameProcessHelper.handleMyInfo(gameInfo.myInfo);

        gameProcessHelper.handleTaskName(gameInfo.taskName);

        gameProcessHelper.handleSubTasksInfo(gameInfo.subTasks);

        gameInfo.otherUsers.forEach((user) => {
            gameProcessHelper.handleUserInfo(user);
        });

        gameProcessHelper.handleGameState();
    },

    handleMyInfo: (myInfo) => {
        gameProcessHelper.changeMyStatus(myInfo.isPlayer);

        gameProcessHelper.updateUserVote(myInfo);
    },

    gameStateChanged: (gameState) => {
        gameProcessHelper._gameState = gameState;

        gameProcessHelper.handleGameState();
    },

    redrawCards: () => {
        let cardZone = $('#planning-poker-gamer-card-zone');

        cardZone.html('');

        gameProcessHelper._cards.forEach((card) => {
            let cardBlock = $(`<div class="planning-poker-card planning-poker-card-clickable ${gameProcessHelper._mapCardColorToClass(card.color)}" score="${card.score}">`);

            cardBlock.html(card.text);

            cardZone.append(cardBlock);
        });

        gameProcessHelper._addClickEventToCards();
    },

    handleSubTasksInfo: (subTasks) => {
        subTasks.sort((a, b) => a.order - b.order).forEach((subTask) => {
            gameProcessHelper.handleSubTaskInfo(subTask);
        });
    },

    handleSubTaskInfo: (subTask) => {
        let isActive;

        if (subTask.isSelected) {
            isActive = "true";
        } else {
            isActive = "false";
        }

        const taskBlock = $(`<div class="planning-poker-tasks-zone-task" active="${isActive}" task-id="${subTask.id}">`);
        const taskNameBlock = $(`<div class="planning-poker-tasks-zone-task-name">${subTask.text}</div>`);

        let scoreBlock;

        if (gameProcessHelper._isAdmin) {
            scoreBlock = $('<select class="form-select shadow-none planning-poker-tasks-zone-task-score">');

            scoreBlock.append($('<option value="">'));

            gameProcessHelper._availableScores.forEach((scoreValue) => {
                let selectedAttr = '';
                if (scoreValue.score === subTask.score) {
                    selectedAttr = 'selected';
                }

                const option = $(`<option ${selectedAttr} value="${scoreValue.score}">`);
                option.html(scoreValue.score);

                scoreBlock.append(option);
            });

            if (!subTask.isSelected || gameProcessHelper._gameState !== 'CardsOpenned') {
                scoreBlock.prop('disabled', true);
            }

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

    handleGameState: () => {
        let subTaskScoreBlock = gameProcessHelper._findSelectedSubTaskScoreBlock();

        if (gameProcessHelper._isAdmin) {
            switch (gameProcessHelper._gameState) {
                case 'Created':
                    subTaskScoreBlock.prop('disabled', true);
                    $('#planning-poker-start-game-button').show();
                    $('#planning-poker-score-next-button').hide();
                    $('#planning-poker-rescore-button').hide();
                    $('#planning-poker-open-cards-button').hide();
                    break;
                case 'Scoring':
                    subTaskScoreBlock.prop('disabled', true);
                    $('#planning-poker-start-game-button').hide();
                    $('#planning-poker-score-next-button').hide();
                    $('#planning-poker-rescore-button').hide();
                    $('#planning-poker-open-cards-button').show();
                    break;
                case 'CardsOpenned':
                    subTaskScoreBlock.prop('disabled', false);
                    $('#planning-poker-start-game-button').hide();
                    $('#planning-poker-score-next-button').show();
                    $('#planning-poker-rescore-button').show();
                    $('#planning-poker-open-cards-button').hide();
                    break;
                case 'Finished':
                    subTaskScoreBlock.prop('disabled', true);
                    $('#planning-poker-start-game-button').show();
                    $('#planning-poker-score-next-button').hide();
                    $('#planning-poker-rescore-button').hide();
                    $('#planning-poker-open-cards-button').hide();
                    break;
                default:
                    break;
            }
        }
    },

    handleShowPlayerScores: (showPlayerScoresModel) => {
        gameProcessHelper.gameStateChanged(showPlayerScoresModel.gameState);

        showPlayerScoresModel.playerScores.forEach((playerScore) => {
            let userCard = gameProcessHelper._findUserCardByUserId(playerScore.userId);

            if (userCard) {
                userCard.find('.planning-poker-card').attr('card-state', 'openned');
                userCard.find('.planning-poker-card').html(playerScore.score);
            }
        });
    },

    handleFlushPlayerScores: (playerScores) => {
        playerScores.forEach((playerScore) => {
            gameProcessHelper.updateUserVote(playerScore);
        });
    },

    onSubTaskScoreChanged: (target) => {
        let subTaskId = $(target).closest('.planning-poker-tasks-zone-task').attr('task-id');
        let scoreStr = $(target).val();

        let score;

        if (scoreStr) {
            score = parseFloat(scoreStr.replace(',', '.'));
        } else {
            score = null;
        }

        hubConnectorHelper.invokeChangeSubTaskScore(subTaskId, score);
    },

    changeMyStatus: (isPlayer) => {
        if (isPlayer) {
            $('#planning-poker-spectate-button').show();
            $('#planning-poker-join-game-button').hide();
            $('#planning-poker-gamer-card-zone').show();
            $('.planning-poker-gamer-score[my-card="true"]').show();
        } else {
            $('#planning-poker-spectate-button').hide();
            $('#planning-poker-join-game-button').show();
            $('#planning-poker-gamer-card-zone').hide();
            $('.planning-poker-gamer-score[my-card="true"]').hide();
        }
    },

    _generateCardState: (userInfo) => {
        let cardState;
        let scoreText;

        if (userInfo.score !== null && gameProcessHelper._gameState === 'CardsOpenned') {
            scoreText = gameProcessHelper._getScoreTextByScore(userInfo.score);
            cardState = 'openned';
        } else {
            scoreText = '';
            if (userInfo.hasVoted) {
                cardState = 'voted';
            } else {
                cardState = 'unvoted';
            }
        }

        let cardInfo = {
            cardState: cardState,
            scoreText: scoreText
        };

        return cardInfo;
    },

    _findUserCardByUserId: (userId) => {
        return $(`.planning-poker-gamer-score[user-id="${userId}"]`);
    },

    _findSubTaskById: (subTaskId) => {
        return gameProcessHelper._subTaskZone.find(`.planning-poker-tasks-zone-task[task-id="${subTaskId}"]`);
    },

    _findSelectedSubTaskScoreBlock: () => {
        return $('.planning-poker-tasks-zone-task[active="true"] .planning-poker-tasks-zone-task-score');
    },

    _addClickEventToCards: () => {
        $('.planning-poker-card-clickable').click((event) => {
            if (gameProcessHelper._gameState !== 'Scoring')
                return;

            let selectedCard = $(event.target);

            let wasSelected = selectedCard.hasClass('planning-poker-card-selected');

            let score;

            if (wasSelected) {
                score = null;
            } else {
                let scoreStr = selectedCard.attr('score');
                score = parseFloat(scoreStr.replace(',', '.'));
            }

            hubConnectorHelper.invokeTryChangeVote(score);

            gameProcessHelper._lastClickedCard = selectedCard;
        });
    },

    _fillAvailableSubTaskScores: () => {
        const cards = gameProcessHelper._cards.slice();

        gameProcessHelper._availableScores = cards.sort((a, b) => a.score - b.score)
            .filter((card) => card.score > 0)
            .map((card) => {
                let availableScore = {
                    score: card.score,
                    text: card.text
                };

                return availableScore;
            });
    },

    _getScoreTextByScore: (score) => {
        let card = gameProcessHelper._cards.find((card) => card.score === score);

        return card.text;
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
