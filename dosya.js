document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('box-container');
    const itemInput = document.getElementById('item-input');
    const boxSelect = document.getElementById('box-select');
    const addButton = document.getElementById('add-button');

    // 12 adet kutu oluştur ve bir adet özel kutu ("Duruşma Listesi") ekle
    for (let i = 1; i <= 13; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.dataset.index = i;
        
        // Kutunun başlığı
        const title = document.createElement('h3');
        if (i === 13) {
            title.textContent = 'Duruşma Listesi'; // Özel kutu
            box.classList.add('special'); // Özel kutu olarak belirtildi
        } else if (i === 12) {
            title.textContent = 'Adı İş Mahkemesi'; // 12. kutu
        } else {
            title.textContent = `Dolap ${i}`; // Diğer kutular
        }

        box.appendChild(title);

        const ul = document.createElement('ul');
        box.appendChild(ul);
        container.appendChild(box);

        // Seçenekler oluşturuluyor
        if (i <= 12) {
            const option = document.createElement('option');
            if (i === 12) {
                option.value = i;
                option.textContent = 'Adı İş Mahkemesi';
            } else {
                option.value = i;
                option.textContent = `Dolap ${i}`;
            }
            boxSelect.appendChild(option);
        }
    }

    // LocalStorage'dan verileri yükle
    loadItemsFromStorage();

    // Madde ekleme işlevi
    addButton.addEventListener('click', () => {
        const inputValue = itemInput.value.trim();
        const selectedBoxNumber = parseInt(boxSelect.value, 10);
        if (inputValue && selectedBoxNumber) {
            addItemToBox(inputValue, selectedBoxNumber);
            itemInput.value = ''; // Girdi alanını temizle
            saveItemsToStorage(); // Verileri kaydet
        }
    });

    // Belirtilen kutuya madde ekleme işlevi
    function addItemToBox(itemText, boxNumber) {
        const targetBox = document.querySelector(`.box[data-index="${boxNumber}"] ul`);
        const li = document.createElement('li');
        li.textContent = itemText;

        // Özel kutuya taşıma butonu (★)
        const specialButton = document.createElement('button');
        specialButton.textContent = '★';
        specialButton.addEventListener('click', () => {
            const specialBox = document.querySelector('.box.special ul');
            specialBox.appendChild(li);
            li.removeChild(specialButton);
            if (!li.querySelector('.delete-button')) {
                li.appendChild(createDeleteButton());
            }
            saveItemsToStorage(); // Verileri kaydet
        });

        // Silme butonu (X)
        li.appendChild(specialButton);
        li.appendChild(createDeleteButton());
        targetBox.appendChild(li);
    }

    // Silme butonunu oluşturan fonksiyon (X)
    function createDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteButton.parentElement.remove();
            saveItemsToStorage(); // Verileri kaydet
        });
        return deleteButton;
    }

    // Verileri localStorage'a kaydetme işlevi
    function saveItemsToStorage() {
        const boxes = document.querySelectorAll('.box ul');
        const items = [];
        boxes.forEach((box, index) => {
            const boxItems = [];
            box.querySelectorAll('li').forEach(li => {
                boxItems.push(li.firstChild.textContent); // İlk çocuk yıldız butonu
            });
            items.push({ boxIndex: index + 1, items: boxItems });
        });
        localStorage.setItem('boxItems', JSON.stringify(items));
    }

    // LocalStorage'dan verileri yükleme işlevi
    function loadItemsFromStorage() {
        const savedItems = JSON.parse(localStorage.getItem('boxItems'));
        if (savedItems) {
            savedItems.forEach(box => {
                box.items.forEach(item => {
                    addItemToBox(item, box.boxIndex);
                });
            });
        }
    }
});