// Adding smooth interaction effects
document.addEventListener('DOMContentLoaded', function() {
    const courses = document.querySelectorAll('.course');

    // Add smooth shadow and lift effect on hover
    courses.forEach(course => {
        course.addEventListener('mouseover', () => {
            course.style.boxShadow = '0 12px 24px rgba(0,0,0,0.18)';
        });

        course.addEventListener('mouseout', () => {
            course.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
        });
    });
});
