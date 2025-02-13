document.addEventListener('DOMContentLoaded', () => {
    const equipmentList = document.getElementById('equipmentList');
    const addEquipmentBtn = document.getElementById('addEquipment');
    const modal = document.getElementById('equipmentModal');
    const closeBtn = document.querySelector('.close');
    const equipmentForm = document.getElementById('equipmentForm');
    const modalTitle = document.getElementById('modalTitle');

    // 修改后的openModal函数
function openModal(equipment = null) {
    const modal = document.getElementById('equipmentModal');
    // 重置表单
    document.getElementById('equipmentForm').reset();
    
    if (equipment) {
        modalTitle.textContent = '编辑设备';
        document.getElementById('equipmentId').value = equipment.id;
        document.getElementById('name').value = equipment.name;
        document.getElementById('type').value = equipment.type;
        document.getElementById('status').value = equipment.status;
        document.getElementById('borrower').value = equipment.borrower || '';
        document.getElementById('borrowDate').value = equipment.borrowDate || '';
        document.getElementById('returnDate').value = equipment.returnDate || '';
    } else {
        modalTitle.textContent = '添加新设备';
    }
    modal.style.display = 'block'; // 确保这行存在
}

// 确保事件监听器正确绑定
document.getElementById('addEquipment').addEventListener('click', () => {
    openModal();
});

    // 关闭模态框
    function closeModal() {
        modal.style.display = 'none';
    }

    // 保存设备信息
    equipmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const equipment = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            status: document.getElementById('status').value,
            borrower: document.getElementById('borrower').value,
            borrowDate: document.getElementById('borrowDate').value,
            returnDate: document.getElementById('returnDate').value,
            createdAt: Date.now()
        };

        const equipmentId = document.getElementById('equipmentId').value;
        if (equipmentId) {
            // 更新现有设备
            database.ref('equipments/' + equipmentId).update(equipment);
        } else {
            // 添加新设备
            database.ref('equipments').push(equipment);
        }

        closeModal();
    });

    // 删除设备
    function deleteEquipment(id) {
        if (confirm('确定要删除此设备吗？')) {
            database.ref('equipments/' + id).remove();
        }
    }

    // 渲染设备列表
    function renderEquipmentList(snapshot) {
        equipmentList.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const equipment = childSnapshot.val();
            const id = childSnapshot.key;
            
            const card = document.createElement('div');
            card.className = 'equipment-card';
            card.innerHTML = `
                <h3>${equipment.name}</h3>
                <p>类型：${equipment.type}</p>
                <p>状态：<span class="status status-${equipment.status}">${equipment.status}</span></p>
                ${equipment.borrower ? `<p>借用人：${equipment.borrower}</p>` : ''}
                ${equipment.borrowDate ? `<p>借用日期：${equipment.borrowDate}</p>` : ''}
                ${equipment.returnDate ? `<p>归还日期：${equipment.returnDate}</p>` : ''}
                <div class="actions">
                    <button onclick="openModal(${JSON.stringify({id, ...equipment})})">编辑</button>
                    <button onclick="deleteEquipment('${id}')">删除</button>
                </div>
            `;
            equipmentList.appendChild(card);
        });
    }

    // 实时监听设备数据变化
    database.ref('equipments').on('value', (snapshot) => {
        renderEquipmentList(snapshot);
    });

    // 事件绑定
    addEquipmentBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // 暴露全局函数
    window.openModal = openModal;
    window.deleteEquipment = deleteEquipment;
});
