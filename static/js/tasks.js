document.addEventListener('DOMContentLoaded', function() {
    console.log('Hello, world!');

    // تابع برای دریافت لیست تسک‌ها از API و نمایش آنها در یک لیست HTML
    function displayTasks() {
        fetch('http://127.0.0.1:8000/api/task-list-create/') // آدرس URL API را وارد کنید
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const taskList = document.getElementById('task-list');
                taskList.innerHTML = ''; // پاک کردن همه تسک‌ها قبل از اضافه کردن تسک‌های جدید

                data.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <button class="delete-button" data-task-id="${task.id}">x</button>
                        <strong style="${task.complete ? 'text-decoration: line-through;' : ''}">${task.title}</strong>
                        <input type="checkbox" ${task.complete ? 'checked' : ''} data-task-id="${task.id}">
                        
                        <label>${task.complete ? 'You Did It' : 'Not Done'}</label><br>
                        
                        <!-- اضافه کردن سایر متغیرها به لیست -->
                    `;
                    if(task.complete) {
                        listItem.classList.add('completed');
                    }

                    // افزودن رویداد dragstart به هر المان تسک
                    listItem.draggable = true;
                    listItem.addEventListener('dragstart', function(event) {
                        event.dataTransfer.setData('text/plain', task.id);
                    });

                    taskList.appendChild(listItem);
                });

                // افزودن رویداد change به هر چک باکس تسک
                const checkboxes = document.querySelectorAll('#task-list input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', function(event) {
                        const taskId = event.target.dataset.taskId;
                        const checked = event.target.checked;
                        updateTaskStatus(taskId, checked);
                    });
                });

                // افزودن event listener به دکمه‌های Delete
                const deleteButtons = document.querySelectorAll('.delete-button');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function(event) {
                        const taskId = event.target.dataset.taskId;
                        deleteTask(taskId);
                    });
                });

                // اعمال مرتب‌سازی به لیست تسک‌ها
                Sortable.create(taskList);
            })

            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
            
    }

    // تابع برای به‌روزرسانی وضعیت تسک
    function updateTaskStatus(taskId, checked) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch(`http://127.0.0.1:8000/api/task-change/${taskId}`, {
            method: 'PATCH', // تغییر متد به PATCH
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken 
            },
            body: JSON.stringify({
                complete: checked // ارسال وضعیت چک باکس به عنوان مقدار complete
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task status');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task status updated successfully:', data);
            
            // بروزرسانی وضعیت ظاهری تسک بدون رفرش صفحه
            const taskElement = document.querySelector(`#task-list input[type="checkbox"][data-task-id="${taskId}"]`);
            const titleElement = taskElement.previousElementSibling;
            const labelElement = taskElement.nextElementSibling;
            if (checked) {
                taskElement.parentElement.classList.add('completed');
                labelElement.textContent = 'You Did It';
                titleElement.style.textDecoration = 'line-through';
                deleteButton.textContent = 'Delete';
            } else {
                taskElement.parentElement.classList.remove('completed');
                labelElement.textContent = 'Not Done';
                titleElement.style.textDecoration = 'none';
            }
        })
        .catch(error => {
            console.error('Error updating task status:', error);
        });
    }

    // تابع برای حذف تسک
    function deleteTask(taskId) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch(`http://127.0.0.1:8000/api/task-change/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            if (response.status === 204) {
                console.log('Task deleted successfully');
                // فقط صدا زدن تابع displayTasks() برای بروزرسانی لیست
                displayTasks();
            } else if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            // نمایش پیام خطا
            console.error('Response status:', error.response.status);
        });
    }
    
    displayTasks();

    // افزودن رویداد drop به دکمه حذف

    document.getElementById("myForm").addEventListener("submit", function(event) {
        event.preventDefault(); // جلوگیری از ارسال فرم به صورت پیش‌فرض

        // گرفتن داده‌های فرم
        var formData = {
            title: document.getElementById("title").value,
            // دیگر داده‌های فرم...
        };
        var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        // آدرس API
        var apiEndpoint = 'http://127.0.0.1:8000/api/task-list-create/';

        // تنظیمات رکوئست
        var requestSettings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // اضافه کردن CSRF token به هدر
                // هدرهای دیگر اگر لازم است
                // هدرهای دیگر اگر لازم است
            },
            body: JSON.stringify(formData)
        };

        // ارسال رکوئست به API
        fetch(apiEndpoint, requestSettings)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                // عملیات دیگر بعد از دریافت پاسخ
                // به روز رسانی صفحه بدون رفرش
                location.reload();
            })
            .catch(function(error) {
                console.error('There was a problem with your fetch operation:', error);
            });
    });
});
