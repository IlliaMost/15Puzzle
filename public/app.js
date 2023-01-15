const socket = io();
//Створюємо кнопку
let newGameButton = document.getElementById('game');
let child1 = document.querySelector('.child1');

//флаг для визначення черги натискання кнопки
let newButtonClicked = true;

//Подія при клікі на кнопку
newGameButton.onclick = start;

//Лічильник ходів
let moveCounter = 0;
let gameTime = 0;

//Функція яка спрацьовує при натискані на кнопку нової гри
function start() {
    let dif = document.querySelector('[name="game-difficulty"]:checked').value;

    if (newButtonClicked) {
        startGame(dif);
        field.style.display = "block";
        startResults();
        newButtonClicked = false; //Змінюється значення флагу
        newGameButton.innerHTML = "Почати знову";
        difficulty.style.display = "none";
        result.style.display = "block";

        if (dif == 5) {
            field.style.position = "relative";
            field.style.left = "25px";
            child1.style.width = '600px';
            child1.style.height = '700px';
        }
    
        if (dif == 6) {
            field.style.position = "relative";
            field.style.left = "40px";
            child1.style.width = '720px';
            child1.style.height = '790px';
        }

    } else {
        window.location.reload(); //Перезаважтажує сторінку
    }
}

function startGame(dif) {
    //Шукаємо field
    const field = document.querySelector('.field');
    //Розмір клітинки
    const cellSize = 100;
    //Складаємо інформації про осередки в масив
    const cells = [];
    //Створюємо та сортуємо масив з числами
    const numbers = [...Array(dif * dif - 1).keys()].sort(() => Math.random() - 0.5);

    for (let i = 0; i <= dif * dif - 2; i++) {
        //Створюємо тег
        const cell = document.createElement('div');
        const value = numbers[i] + 1;
        cell.className = 'cell';
        //Записуємо в клітинку значення
        cell.innerHTML = value;

        //Позиція у рядку
        const left = i % dif;
        //позиція у стовбці
        const top = (i - left) / dif;

        //Записуємо клітинку у масив
        cells.push({
            value: value,
            left: left,
            top: top,
            element: cell
        });

        //Зрушуємо координати
        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;

        //Додаєм клітинку в поле field
        field.append(cell);

        //При обробці події спрацьовує функція
        cell.addEventListener('click', () => {
            move(i);
        })
    }

    //Координати пустої клітинки
    const empty = {
        value: dif * dif,
        top: dif - 1,
        left: dif - 1,
    }
    //Заносимо пусту клітинку в масив
    cells.push(empty);


    function move(index) {
        //Дістаємо клітинку
        const cell = cells[index];

        //Беремо різницю за координатою
        const leftDiff = Math.abs(empty.left - cell.left);
        const topDiff = Math.abs(empty.top - cell.top);

        //якщо різниця більше одного, то клітинка не є сусідньою
        if (leftDiff + topDiff > 1) {
            return;
        }
        moveCounter++;
        //Рухаємося на попередню клітинку
        cell.element.style.left = `${empty.left * cellSize}px`;
        cell.element.style.top = `${empty.top * cellSize}px`;

        //Координати пустої клітинки
        const emptyLeft = empty.left;
        const emptyTop = empty.top;

        //Записуємо координати поточної клітинки
        empty.left = cell.left;
        empty.top = cell.top;

        //В клітинку передаєм записані значення
        cell.left = emptyLeft;
        cell.top = emptyTop;

        //Метод every перевіряє умову для кожного елемента
        const isFinished = cells.every(cell => {
            //Перевірка на правильну координату
            return cell.value === cell.top * dif + cell.left + 1;
        });

        if (isFinished) {
            alert('Ви вирішили пазл за ' + gameTime + ' секунд та ' + moveCounter + ' ходів');
            window.location.reload();
        }
    }

}

//Результати
function startResults() {
    const moveContainer = document.querySelector('.move-text');
    const timeContainer = document.querySelector('.time-text');
    moveContainer.innerHTML = '' + moveCounter;
    timeContainer.innerHTML = '' + gameTime;
    //Оновлюєм контейнер кроків
    const movesUpdate = setInterval(
        () => {
            moveContainer.innerHTML = '' + moveCounter;
        },
        100);
    //Оновлюєм контейнер часу
    const gameInterval = setInterval(
        () => {
            timeContainer.innerHTML = '' + ++gameTime;
        },
        1000);
}