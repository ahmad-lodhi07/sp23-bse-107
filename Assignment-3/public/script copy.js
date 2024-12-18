// Project details data
const projectDetails = {
    1: {
        title: "Online Bus Ticket Booking System",
        content: "A comprehensive web-based solution for booking bus tickets online. The system features user authentication, real-time seat selection, secure payment processing, and automated ticket generation. Built using modern web technologies to ensure a smooth and efficient booking experience."
    },
    2: {
        title: "IT Industry Employee Management",
        content: "An innovative desktop application designed to streamline employee management in IT companies. The system includes modules for attendance tracking, performance evaluation, project assignment, and leave management. Enhanced with data analytics capabilities for better decision-making."
    },
    3: {
        title: "Hospital Management System",
        content: "A sophisticated hospital management solution utilizing advanced data structures for efficient patient care. The system implements priority queues for emergency management, hash tables for quick patient lookup, and graph algorithms for resource optimization."
    },
    4: {
        title: "Mitchell's Fruit Farm Website",
        content: "A modern e-commerce website for Mitchell's Fruit Farm featuring product catalogs, online ordering, and customer relationship management. The responsive design ensures optimal viewing across all devices, while the intuitive interface enhances user experience."
    }
};


const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

function showProjectDetails(projectId) {
    modalTitle.textContent = projectDetails[projectId].title;
    modalContent.textContent = projectDetails[projectId].content;
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}


// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}