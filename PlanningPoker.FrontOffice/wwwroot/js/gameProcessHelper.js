/*jshint esversion: 6 */

$(document).ready(() => {
    gameProcessHelper.init();
});

let gameProcessHelper = {
    _hubConnector: {},
    _cookieManager: {},
    _subTaskZone: {},

    _myUserId: '',
    _isAdmin: false,
    _gameState: null,
    _users: [],
    _lastClickedCard: null,
    _cards: null,
    _availableScores: null,
    _editTaskMode: false,

    gameId: '',
    isPlayerCookieValue: null,

    init: () => {
        const hubConnector = new HubConnector();
        const cookieManager = new CookieManager();

        gameProcessHelper._hubConnector = hubConnector;
        gameProcessHelper._cookieManager = cookieManager;

        gameProcessHelper.gameId = $('#planning-poker-game-id').val();
        gameProcessHelper._myUserId = $('#planning-poker-user-id').val();

        gameProcessHelper.isPlayerCookieValue = $('#planning-poker-is-player-cookie-value').val().toLowerCase() === 'true';

        gameProcessHelper._addClickEventToCards();

        gameProcessHelper._subTaskZone = $('#planning-poker-tasks-zone');

        $('#planning-poker-spectate-button').click(() => {
            gameProcessHelper._hubConnector.invokeSpectate();
        });

        $('#planning-poker-join-game-button').click(() => {
            gameProcessHelper._hubConnector.invokeJoinGame();
        });

        $('#planning-poker-start-game-button').click(() => {
            if (gameProcessHelper._gameState !== 'Created' && gameProcessHelper._gameState !== 'Finished') {
                return;
            }

            gameProcessHelper._hubConnector.invokeStartGame();
        });

        $('#planning-poker-open-cards-button').click(() => {
            if (gameProcessHelper._gameState !== 'Scoring') {
                return;
            }

            gameProcessHelper._hubConnector.invokeTryOpenCards();
        });

        $('#planning-poker-rescore-button').click(() => {
            if (gameProcessHelper._gameState !== 'CardsOpenned') {
                return;
            }

            gameProcessHelper._hubConnector.invokeRescoreSubTask();
        });

        $('#planning-poker-score-next-button').click(() => {
            if (gameProcessHelper._gameState !== 'CardsOpenned') {
                return;
            }

            gameProcessHelper._hubConnector.invokeScoreNextSubTask();
        });

        $('#planning-poker-finish-game-button').click(() => {
            if (gameProcessHelper._gameState !== 'CardsOpenned') {
                return;
            }

            gameProcessHelper._hubConnector.invokeFinishGame();
        });

        $('#planning-poker-edit-task-button').click(() => {
            gameProcessHelper._editTask();
        });

        gameProcessHelper._hubConnector.init();
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
        gameProcessHelper._addUserToLocalCache(user);

        const existingUserCard = gameProcessHelper._findUserCardByUserId(user.userId);

        if (!user.isPlayer) {
            existingUserCard.remove();
            return;
        }

        const scoreBlock = $('<div class="planning-poker-gamer-score">');
        scoreBlock.attr('user-id', user.userId);

        const isMyCard = gameProcessHelper._myUserId === user.userId;
        if (isMyCard) {
            scoreBlock.attr('my-card', 'my-card');
        }

        const cardInfo = gameProcessHelper._generateCardState(user);

        const card = $(`<div class="planning-poker-card">`);
        card.attr('card-state', cardInfo.cardState);
        card.html(cardInfo.scoreText);

        const userNameBlock = $('<div class="planning-poker-gamer-name">');
        userNameBlock.html(user.name);

        scoreBlock.append(card);
        scoreBlock.append(userNameBlock);

        if (existingUserCard.length > 0) {
            existingUserCard.after(scoreBlock);
            existingUserCard.remove();
        } else {
            if (isMyCard) {
                $('.planning-poker-gamers-zone').prepend(scoreBlock);
            } else {
                $('.planning-poker-gamers-zone').append(scoreBlock);
            }
        }
    },

    removeUser: (userId) => {
        gameProcessHelper._removeUserFromLocalCache(userId);

        const existingUserCard = gameProcessHelper._findUserCardByUserId(userId);

        if (existingUserCard.length < 1) {
            return;
        }

        existingUserCard.remove();
    },

    updateUserVote: (user) => {
        gameProcessHelper._updateUserVoteInLocalCache(user);

        const userCard = gameProcessHelper._findUserCardByUserId(user.userId);

        if (userCard.length === 0) {
            return;
        }

        const cardInfo = gameProcessHelper._generateCardState(user);

        const userCardBlock = userCard.find('.planning-poker-card');
        userCardBlock.attr('card-state', cardInfo.cardState);
        userCardBlock.addClass(cardInfo.className);
        userCardBlock.html(cardInfo.scoreText);

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
        vueApp.setGameInfo(gameInfo);

        gameProcessHelper._isAdmin = gameInfo.myInfo.userId === gameInfo.adminId;

        gameProcessHelper._cards = gameInfo.cards;

        gameProcessHelper._fillAvailableSubTaskScores();

        gameProcessHelper._gameState = gameInfo.gameState;

        gameProcessHelper.redrawCards();

        gameProcessHelper.changeMyStatus(gameInfo.myInfo.isPlayer);

        gameProcessHelper.handleUserInfo(gameInfo.myInfo);

        gameProcessHelper.updateUserVote(gameInfo.myInfo);

        gameProcessHelper.handleTaskName(gameInfo.taskName);

        gameProcessHelper.handleSubTasksInfo(gameInfo.subTasks);

        gameInfo.otherUsers.forEach((user) => {
            gameProcessHelper.handleUserInfo(user);
        });

        gameProcessHelper.actualizeButtons();
    },

    gameStateChanged: (gameState) => {
        gameProcessHelper._gameState = gameState;
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
        $('#planning-poker-tasks-zone').html('');

        subTasks.sort((a, b) => a.order - b.order).forEach((subTask) => {
            gameProcessHelper.handleSubTaskInfo(subTask);
        });

        vueApp.updateSubTasks(subTasks);
    },

    handleSubTaskInfo: (subTask) => {
        if (subTask.isSelected) {
            $('.planning-poker-tasks-zone-task[active="true"]').attr('active', false);
        }

        const taskBlock = $(`<div class="planning-poker-tasks-zone-task" order="${subTask.order}" active="${subTask.isSelected}" task-id="${subTask.id}">`);
        const taskNameBlock = $(`<div class="planning-poker-tasks-zone-task-name">${subTask.text}</div>`);

        let scoreBlock;

        if (gameProcessHelper._isAdmin) {
            scoreBlock = $('<select class="form-select shadow-none planning-poker-tasks-zone-task-score">');

            const emptyOption = $('<option value="">');
            emptyOption.html('-');

            scoreBlock.append(emptyOption);

            gameProcessHelper._availableScores.forEach((scoreValue) => {
                let selectedAttr = '';
                if (scoreValue.score === subTask.score) {
                    selectedAttr = 'selected';
                }

                const option = $(`<option ${selectedAttr} value="${scoreValue.score}">`);
                option.html(scoreValue.score);

                scoreBlock.append(option);
            });
        } else {
            scoreBlock = $('<div class="planning-poker-tasks-zone-task-score">');

            let scoreText;
            if (subTask.score === null) {
                scoreText = '-';
            } else {
                scoreText = subTask.score;
            }

            scoreBlock.html(scoreText);
        }

        scoreBlock.change((event) => gameProcessHelper.onSubTaskScoreChanged(event.target));

        taskBlock.append(taskNameBlock);
        taskBlock.append(scoreBlock);

        taskNameBlock.off('click');

        if(!subTask.isSelected) {
            taskNameBlock.click((event) => {
                modalWindowHelper.showConfirmDialog('Перейти к оценке этой задачи?', () => {
                    const subTaskId = $(event.target).closest('.planning-poker-tasks-zone-task').attr('task-id');
                    gameProcessHelper._hubConnector.invokeScoreSubTaskById(subTaskId);

                    return true;
                });
            })
        }

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

    actualizeButtons: () => {
        if (gameProcessHelper._isAdmin) {
            $('#planning-poker-admin-buttons-group').show();
            $('#planning-poker-edit-task-button').show();
        } else {
            $('#planning-poker-admin-buttons-group').hide();
            $('#planning-poker-edit-task-button').hide();
        }

        const hasPlayers = gameProcessHelper._hasPlayersInGame();
        const isPlayer = gameProcessHelper._isPlayer();

        $('.planning-poker-tasks-zone-task-score').prop('disabled', true);

        switch (gameProcessHelper._gameState) {
            case 'Created':
                $('#planning-poker-gamer-card-zone').attr('active', 'false');

                if (hasPlayers) {
                    $('#planning-poker-start-game-button').show();
                    $('#planning-poker-waiting-players-banner').hide();
                } else {
                    $('#planning-poker-start-game-button').hide();
                    $('#planning-poker-waiting-players-banner').show();
                }

                $('#planning-poker-finish-game-button').hide();
                $('#planning-poker-score-next-button').hide();
                $('#planning-poker-rescore-button').hide();
                $('#planning-poker-open-cards-button').hide();
                break;
            case 'Scoring':
                if (isPlayer) {
                    $('#planning-poker-gamer-card-zone').attr('active', 'true');
                } else {
                    $('#planning-poker-gamer-card-zone').attr('active', 'false');
                }

                if (hasPlayers) {
                    $('#planning-poker-open-cards-button').show();
                    $('#planning-poker-waiting-players-banner').hide();
                } else {
                    $('#planning-poker-open-cards-button').hide();
                    $('#planning-poker-waiting-players-banner').show();
                }

                $('#planning-poker-finish-game-button').hide();
                $('#planning-poker-start-game-button').hide();
                $('#planning-poker-score-next-button').hide();
                $('#planning-poker-rescore-button').hide();
                break;
            case 'CardsOpenned':
                if (isPlayer) {
                    $('#planning-poker-gamer-card-zone').attr('active', 'true');
                } else {
                    $('#planning-poker-gamer-card-zone').attr('active', 'false');
                }

                $('#planning-poker-waiting-players-banner').hide();

                let isFinalSubTask = gameProcessHelper._isFinalSubTask();

                if (isFinalSubTask) {
                    $('#planning-poker-finish-game-button').show();
                    $('#planning-poker-score-next-button').hide();
                } else {
                    $('#planning-poker-score-next-button').show();
                    $('#planning-poker-finish-game-button').hide();
                }

                let subTaskScoreBlock = gameProcessHelper._findSelectedSubTaskScoreBlock();
                subTaskScoreBlock.prop('disabled', false);

                $('#planning-poker-start-game-button').hide();
                $('#planning-poker-rescore-button').show();
                $('#planning-poker-open-cards-button').hide();
                break;
            case 'Finished':
                $('#planning-poker-gamer-card-zone').attr('active', 'false');

                if (hasPlayers) {
                    $('#planning-poker-start-game-button').show();
                    $('#planning-poker-waiting-players-banner').hide();
                } else {
                    $('#planning-poker-start-game-button').hide();
                    $('#planning-poker-waiting-players-banner').show();
                }

                $('#planning-poker-finish-game-button').hide();
                $('#planning-poker-score-next-button').hide();
                $('#planning-poker-rescore-button').hide();
                $('#planning-poker-open-cards-button').hide();
                break;
            default:
                break;
        }
    },

    handleShowPlayerScores: (playerScores) => {
        playerScores.forEach((playerScore) => {
            const userCard = gameProcessHelper._findUserCardByUserId(playerScore.userId);

            if (userCard) {
                const cardInfo = gameProcessHelper._getCardInfoByScore(playerScore.score);

                const cardContentBlock = userCard.find('.planning-poker-card');
                cardContentBlock.attr('card-state', 'openned');
                cardContentBlock.html(cardInfo.text);
            }
        });

        const subTaskScoreBlock = gameProcessHelper._findSelectedSubTaskScoreBlock();
        subTaskScoreBlock.prop('disabled', false);
    },

    handleFlushPlayerScores: (playerScores) => {
        playerScores.forEach((playerScore) => {
            gameProcessHelper.updateUserVote(playerScore);
        });
    },

    onSubTaskScoreChanged: (target) => {
        const subTaskId = $(target).closest('.planning-poker-tasks-zone-task').attr('task-id');
        const scoreStr = $(target).val();

        let score;

        if (scoreStr) {
            score = parseFloat(scoreStr.replace(',', '.'));
        } else {
            score = null;
        }

        gameProcessHelper._hubConnector.invokeChangeSubTaskScore(subTaskId, score);
    },

    changeMyStatus: (isPlayer) => {
        if (isPlayer) {
            gameProcessHelper._cookieManager.setCookie("IsPlayerCookieValue", 'true');
            $('#planning-poker-spectate-button').show();
            $('#planning-poker-join-game-button').hide();
            $('#planning-poker-gamer-card-zone').attr('active', 'true');
            $('.planning-poker-gamer-score[my-card]').show();
        } else {
            gameProcessHelper._cookieManager.setCookie("IsPlayerCookieValue", 'false');
            $('#planning-poker-spectate-button').hide();
            $('#planning-poker-join-game-button').show();
            $('#planning-poker-gamer-card-zone').attr('active', 'false');
            $('.planning-poker-gamer-score[my-card]').hide();
        }

        $('.planning-poker-card-selected').removeClass('planning-poker-card-selected');
    },

    updateSubTasks: (subTasks) => {
        gameProcessHelper._hubConnector.invokeUpdateSubTasks(subTasks);
    },

    _generateCardState: (userInfo) => {
        let cardState;
        let cardInfo;
        let scoreText;

        if (userInfo.score !== null && gameProcessHelper._gameState === 'CardsOpenned') {
            cardInfo = gameProcessHelper._getCardInfoByScore(userInfo.score);

            scoreText = cardInfo.text;
            cardState = 'openned';
        } else {
            scoreText = '';
            if (userInfo.hasVoted) {
                cardState = 'voted';
            } else {
                cardState = 'unvoted';
            }
        }

        const result = {
            cardState: cardState,
            scoreText: scoreText,
        };

        return result;
    },

    _findUserCardByUserId: (userId) => {
        return $(`.planning-poker-gamer-score[user-id="${userId}"]`);
    },

    _findSubTaskById: (subTaskId) => {
        return gameProcessHelper._subTaskZone.find(`.planning-poker-tasks-zone-task[task-id="${subTaskId}"]`);
    },

    _findSelectedSubTaskBlock: () => {
        return $('.planning-poker-tasks-zone-task[active="true"]');
    },

    _findSelectedSubTaskScoreBlock: () => {
        return gameProcessHelper._findSelectedSubTaskBlock().find('.planning-poker-tasks-zone-task-score');
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

            gameProcessHelper._hubConnector.invokeTryChangeVote(score);

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

    _getCardInfoByScore: (score) => {
        let card = gameProcessHelper._cards.find((card) => card.score === score);

        return card;
    },

    _actualizeOpenCardsButtonState: () => {
        const hasUnvotedUsers = gameProcessHelper._users.find((usr) => usr.isPlayer && usr.isActive && !usr.hasVoted);

        if (!hasUnvotedUsers) {
            $('#planning-poker-open-cards-button').prop('disabled', false);
        } else {
            $('#planning-poker-open-cards-button').prop('disabled', true);
        }
    },

    _hasPlayersInGame: () => {
        const player = gameProcessHelper._users.find((usr) => usr.isActive && usr.isPlayer);

        if (player) {
            return true;
        } else {
            return false;
        }
    },

    _addUserToLocalCache: (user) => {
        const existingUser = gameProcessHelper._users.find((usr) => usr.userId === user.userId);

        if (existingUser) {
            for (var i = 0; i < gameProcessHelper._users.length; i++) {

                if (gameProcessHelper._users[i].userId === existingUser.userId) {
                    gameProcessHelper._users.splice(i, 1);
                }

            }
        }

        gameProcessHelper._users.push(user);

        gameProcessHelper._syncVueUserList();
        gameProcessHelper._actualizeOpenCardsButtonState();
    },

    _removeUserFromLocalCache: (userId) => {
        const existingUser = gameProcessHelper._users.find((usr) => usr.userId === userId);

        if (existingUser) {
            for (var i = 0; i < gameProcessHelper._users.length; i++) {

                if (gameProcessHelper._users[i].userId === existingUser.userId) {
                    gameProcessHelper._users.splice(i, 1);
                }

            }
        }
        gameProcessHelper._syncVueUserList();
        gameProcessHelper._actualizeOpenCardsButtonState();
    },

    _updateUserVoteInLocalCache: (user) => {
        const existingUser = gameProcessHelper._users.find((usr) => usr.userId === user.userId);

        if (existingUser) {
            existingUser.hasVoted = user.hasVoted;
        }

        gameProcessHelper._syncVueUserList();
        gameProcessHelper._actualizeOpenCardsButtonState();
    },

    _isPlayer: () => {
        const myId = gameProcessHelper._myUserId;

        const myUser = gameProcessHelper._users.find((usr) => usr.userId === myId);

        return myUser.isPlayer;
    },

    _isFinalSubTask: () => {
        const selectedSubTaskBlock = gameProcessHelper._findSelectedSubTaskBlock();

        const selectedOrder = parseInt(selectedSubTaskBlock.attr('order'));

        let maxOrder = 0;

        $('.planning-poker-tasks-zone-task').each((_, item) => {
            const orderStr = $(item).attr('order');
            const order = parseInt(orderStr);
            if (order > maxOrder) {
                maxOrder = order;
            }
        });

        return maxOrder === selectedOrder;
    },

    _syncVueUserList: () => {
        vueApp.setUsers(gameProcessHelper._users);
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
