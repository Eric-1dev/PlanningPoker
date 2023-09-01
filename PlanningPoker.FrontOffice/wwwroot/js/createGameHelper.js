$(document).ready(() => {
    createGameHelper.init();
});

let createGameHelper = {
    init: () => {

        createGameHelper._taskNameTemplate = $('#planning-poker-create-game-task-name-template > div');
        
        createGameHelper._bindAddEvent($('.planning-poker-add-subtask-button'));
        createGameHelper._bindDeleteEvent($('.planning-poker-delete-subtask-button'));

        $('#planning-poker-create-game-button').click(() => createGameHelper._createGame());
    },

    _taskNameTemplate: {},

    _bindAddEvent: (target) => {
        $(target).click((event) => {
            let area = $(event.target).closest('.planning-poker-task-name-container');

            createGameHelper._insertNewInputAfter(area);
        });
    },

    _bindDeleteEvent: (target) => {
        $(target).click((event) => {
            let allAreas = $('.planning-poker-task-name-container');

            if (allAreas.length <= 2) {
                return;
            }

            let area = $(event.target).closest('.planning-poker-task-name-container');

            if (area.find('.planning-poker-subtask-name').val() !== '') {
                modalWindowHelper.showConfirm('Вы действительно хотите удалить строку?', () => { area.remove(); return true; });
            }

            area.remove();
        });
    },

    _insertNewInputAfter: (previousItem) => {
        let newInput = createGameHelper._taskNameTemplate.clone();

        createGameHelper._bindAddEvent(newInput.find('.planning-poker-add-subtask-button'));
        createGameHelper._bindDeleteEvent(newInput.find('.planning-poker-delete-subtask-button'));

        previousItem.after(newInput);

        newInput.find('.planning-poker-subtask-name').focus();
    },

    _createGame: () => {
        let url = $('.planning-poker-create-game-form-wrapper').attr('planning-poker-create-game-url');

        let taskName = $('.planning-poker-create-game-form-container .planning-poker-task-name').val();

        let subTasks = [];

        $('.planning-poker-create-game-form-container .planning-poker-subtask-name').each((_, item) => {
            let text = $(item).val();
            if (text) {
                subTasks.push(text);
            }
        });

        if (!taskName) {
            modalWindowHelper.showError('Укажите название задачи');
            return;
        }

        $.ajax({
            url: url,
            type: 'POST',
            data: { taskName: taskName, subTasks: subTasks },
            success: (data) => {
                if (data.isSuccess) {
                    modalWindowHelper.showInfo(data.message);
                } else {
                    modalWindowHelper.showError(data.message);
                }
            }
        });
    }
};
