// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        console.log(`Navigation clicked: ${targetId}`);
        
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
            section.style.display = 'none';
        });
        
        // Remove active class from all nav links
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Show target section
        const targetSection = document.getElementById(targetId);
        targetSection.classList.add('active-section');
        targetSection.style.display = 'block';
        
        // If schedule link, create/update the schedule view
        if (targetId === 'schedule') {
            console.log("Schedule link clicked, creating schedule view");
            
            // Try both methods to ensure the schedule appears
            try {
                // First try the normal method
                initializeScheduleView();
                updateScheduleView();
            } catch (error) {
                console.error("Error in standard schedule view methods:", error);
            }
            
            // Then use the simple method as a fallback
            // This ensures something will display even if there are issues
            if (!document.querySelector('.schedule-table')) {
                console.log("No schedule table found after standard methods, using fallback");
                createSimpleScheduleView();
            }
        }
    });
});

// Period schedule definition for Phillips Academy
const periodSchedule = {
    1: {
        Monday: "8:30-9:10 a.m.",
        Tuesday: "",
        Wednesday: "8:30-9:45 a.m.",
        Thursday: "",
        Friday: "8:30-9:45 a.m."
    },
    2: {
        Monday: "9:20-10:00 a.m.",
        Tuesday: "",
        Wednesday: "10:20-11:35 a.m.",
        Thursday: "",
        Friday: "9:55-11:10 a.m."
    },
    3: {
        Monday: "10:50-11:30 a.m.",
        Tuesday: "8:30-9:45 a.m.",
        Wednesday: "",
        Thursday: "8:30-9:45 a.m.",
        Friday: ""
    },
    4: {
        Monday: "11:40 a.m.-12:20 p.m.",
        Tuesday: "10:45 a.m.-Noon",
        Wednesday: "",
        Thursday: "10:45 a.m.-Noon",
        Friday: ""
    },
    5: {
        Monday: "12:30-1:10 p.m.",
        Tuesday: "12:10-1:25 p.m.",
        Wednesday: "",
        Thursday: "12:10-1:25 p.m.",
        Friday: ""
    },
    6: {
        Monday: "1:20-2:00 p.m.",
        Tuesday: "1:35-2:50 p.m.",
        Wednesday: "",
        Thursday: "1:35-2:50 p.m.",
        Friday: ""
    },
    "4(L)": {
        Monday: "11:40 a.m.-12:20 p.m.",
        Tuesday: "10:45 a.m.-Noon",
        Wednesday: "",
        Thursday: "10:45 a.m.-Noon",
        Friday: ""
    },
    "5(L)": {
        Monday: "12:30-1:10 p.m.",
        Tuesday: "12:10-1:25 p.m.",
        Wednesday: "",
        Thursday: "12:10-1:25 p.m.",
        Friday: ""
    },
    "6(L)": {
        Monday: "1:20-2:00 p.m.",
        Tuesday: "1:35-2:50 p.m.",
        Wednesday: "",
        Thursday: "1:35-2:50 p.m.",
        Friday: ""
    },
    7: {
        Monday: "2:10-2:50 p.m.",
        Tuesday: "",
        Wednesday: "11:45 a.m.-1:00 p.m.",
        Thursday: "",
        Friday: "1:35-2:50 p.m."
    }
};

// Special times in the schedule
const specialSchedule = {
    "Conference": {
        Monday: "10:05-10:45 a.m.",
        Wednesday: "9:50-10:15 a.m."
    },
    "Department Meeting": {
        Thursday: "9:50-10:40 a.m."
    },
    "Advising": {
        Tuesday: "9:55-10:35 a.m."
    },
    "Community Meeting": {
        Friday: "11:20 a.m.-12:20 p.m."
    },
    "Protected Time/Full Team Meetings": {
        Friday: "12:25-1:25 p.m."
    },
    "Athletics and Community Engagement": {
        All: "3:00-5:00 p.m."
    }
};

// Course data from Andover's Course of Study
const courses = [
    {
        id: 'ENG100',
        name: 'English 100',
        department: 'english',
        description: 'English 100 develops the skills of careful reading, critical thinking, and effective writing. This foundational course prepares students to read a wide range of literature with understanding and enjoyment and to write with clarity and grace.',
        credits: 3, // 3 terms
        term: 'all', // All three terms
        level: 100,
        schedule: {
            periods: [1],
            days: ['Monday', 'Wednesday', 'Friday']
        },
        requirements: ['english'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 12,
        termDesignation: 'T1, T2, T3', // Fall, Winter, Spring
        gradeLevel: 'Junior' // 9th grade
    },
    {
        id: 'ENG200',
        name: 'English 200',
        department: 'english',
        description: 'Building on the foundation of English 100, this course introduces students to a broader range of literature including poetry, drama, fiction, and nonfiction.',
        credits: 3, // 3 terms
        term: 'all',
        level: 200,
        schedule: {
            periods: [3],
            days: ['Tuesday', 'Thursday']
        },
        requirements: ['english'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 10,
        termDesignation: 'T1, T2, T3',
        gradeLevel: 'Lower' // 10th grade
    },
    {
        id: 'ENG300',
        name: 'English 300',
        department: 'english',
        description: 'English 300 builds upon foundational skills developed in previous courses, focusing on literary analysis and various writing forms.',
        credits: 3,
        term: 'all',
        level: 300,
        schedule: {
            periods: [2],
            days: ['Monday', 'Wednesday', 'Friday']
        },
        requirements: ['english'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 13,
        termDesignation: 'T1, T2, T3',
        gradeLevel: 'Upper' // 11th grade
    },
    {
        id: 'MATH280',
        name: 'Precalculus with Statistics',
        department: 'math',
        description: 'This course provides the foundation for the study of calculus. Content includes polynomial, rational, exponential, logarithmic, and trigonometric functions, with a focus on statistical analysis.',
        credits: 3,
        term: 'all',
        level: 200,
        schedule: {
            periods: [2],
            days: ['Monday', 'Wednesday', 'Friday']
        },
        requirements: ['math'],
        instructor: 'Department Staff',
        maxEnrollment: 18,
        currentEnrollment: 14,
        termDesignation: 'T1, T2, T3'
    },
    {
        id: 'MATH340',
        name: 'Calculus',
        department: 'math',
        description: 'An introduction to the calculus of functions of a single variable. It includes differential and integral calculus with applications.',
        credits: 3,
        term: 'all',
        level: 300,
        schedule: {
            periods: [3],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        requirements: ['math'],
        instructor: 'Department Staff',
        maxEnrollment: 18,
        currentEnrollment: 16,
        termDesignation: 'T1, T2, T3'
    },
    {
        id: 'MATH500',
        name: 'AP Calculus AB',
        department: 'math',
        description: 'This course is equivalent to a first-semester college calculus course. Topics include limits, derivatives, and integrals of algebraic and transcendental functions and their applications.',
        credits: 3,
        term: 'all',
        level: 500,
        schedule: {
            periods: ["4(L)"],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        prerequisites: ['MATH340 or department permission'],
        requirements: ['math'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 12,
        termDesignation: 'T1, T2, T3'
    },
    {
        id: 'PHY300',
        name: 'Physics 300',
        department: 'science',
        description: 'An algebra-based physics course covering mechanics, electricity and magnetism, waves, and optics.',
        credits: 3,
        term: 'all',
        level: 300,
        schedule: {
            periods: ["5(L)"],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        requirements: ['science'],
        instructor: 'Department Staff',
        maxEnrollment: 16,
        currentEnrollment: 14,
        termDesignation: 'T1, T2, T3',
        labScience: true
    },
    {
        id: 'CHM300',
        name: 'Chemistry 300',
        department: 'science',
        description: 'An introduction to the principles of chemistry, including atomic structure, chemical bonding, states of matter, chemical reactions, and stoichiometry.',
        credits: 3,
        term: 'all',
        level: 300,
        schedule: {
            periods: ["6(L)"],
            days: ['Tuesday', 'Thursday']
        },
        requirements: ['science'],
        instructor: 'Department Staff',
        maxEnrollment: 16,
        currentEnrollment: 13,
        termDesignation: 'T1, T2, T3',
        labScience: true
    },
    {
        id: 'BIO100',
        name: 'Biology 100',
        department: 'science',
        description: 'This course provides an introduction to biological concepts and principles, including cell structure and function, genetics, evolution, and ecology.',
        credits: 3,
        term: 'all',
        level: 100,
        schedule: {
            periods: [7],
            days: ['Monday', 'Wednesday', 'Friday']
        },
        requirements: ['science'],
        instructor: 'Department Staff',
        maxEnrollment: 16,
        currentEnrollment: 12,
        termDesignation: 'T1, T2, T3',
        labScience: true,
        gradeLevel: 'Junior'
    },
    {
        id: 'HSS300',
        name: 'History 300: U.S. History',
        department: 'history',
        description: 'This course surveys the major themes, events, and personalities in American history from the colonial period to the present.',
        credits: 3,
        term: 'all',
        level: 300,
        schedule: {
            periods: ["4(L)"],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        requirements: ['history'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 13,
        termDesignation: 'T1, T2, T3'
    },
    {
        id: 'HSS100A',
        name: 'History 100A: World History',
        department: 'history',
        description: 'This course examines the development of world civilizations from ancient times to the early modern period, with particular emphasis on cultural, political, and economic developments.',
        credits: 1,
        term: 'fall',
        level: 100,
        schedule: {
            periods: ["4(L)"],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        requirements: ['history'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 11,
        termDesignation: 'T1',
        gradeLevel: 'Junior'
    },
    {
        id: 'HSS100B',
        name: 'History 100B: World History',
        department: 'history',
        description: 'This course continues the examination of world civilizations from the early modern period to the present.',
        credits: 1,
        term: 'winter',
        level: 100,
        schedule: {
            periods: ["4(L)"],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        requirements: ['history'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 11,
        termDesignation: 'T2',
        gradeLevel: 'Junior'
    },
    {
        id: 'HSS201',
        name: 'History 201: The United States',
        department: 'history',
        description: 'This course examines the history of the United States with a focus on key turning points and themes that have shaped the nation.',
        credits: 1,
        term: 'winter',
        level: 200,
        schedule: {
            periods: [3],
            days: ['Monday', 'Tuesday', 'Thursday']
        },
        requirements: ['history'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 10,
        termDesignation: 'T2',
        gradeLevel: 'Lower'
    },
    {
        id: 'ART225',
        name: 'Art 225: Introductory Art',
        department: 'art',
        description: 'This course introduces students to the fundamentals of visual art, including drawing, painting, and design principles.',
        credits: 1,
        term: 'fall',
        level: 200,
        schedule: {
            periods: [7],
            days: ['Monday', 'Friday']
        },
        requirements: ['art'],
        instructor: 'Department Staff',
        maxEnrollment: 12,
        currentEnrollment: 8,
        termDesignation: 'T1',
        gradeLevel: 'Junior'
    },
    {
        id: 'MUS225',
        name: 'Music 225: Introductory Music',
        department: 'music',
        description: 'An introduction to music theory, history, and performance. Students develop skills in music literacy, analysis, and appreciation.',
        credits: 1,
        term: 'winter',
        level: 200,
        schedule: {
            periods: ["6(L)"],
            days: ['Monday', 'Thursday']
        },
        requirements: ['music'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 10,
        termDesignation: 'T2',
        gradeLevel: 'Junior'
    },
    {
        id: 'PHD200',
        name: 'Physical Education 200',
        department: 'pe',
        description: 'This course provides instruction in a variety of physical activities and focuses on developing skills, fitness, and an understanding of wellness concepts.',
        credits: 1,
        term: 'spring',
        level: 200,
        schedule: {
            periods: ["Athletics"],
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        requirements: ['physical_education'],
        instructor: 'Department Staff',
        maxEnrollment: 20,
        currentEnrollment: 15,
        termDesignation: 'T3',
        gradeLevel: 'Lower'
    },
    {
        id: 'PHR300',
        name: 'Introduction to Philosophy',
        department: 'philosophy',
        description: 'An introduction to major philosophical questions and traditions. Students engage with philosophical texts and develop critical thinking skills through discussion and writing.',
        credits: 1,
        term: 'winter',
        level: 300,
        schedule: {
            periods: [3],
            days: ['Tuesday', 'Thursday']
        },
        requirements: ['philosophy'],
        instructor: 'Department Staff',
        maxEnrollment: 15,
        currentEnrollment: 12,
        termDesignation: 'T2',
        gradeLevel: 'Lower'
    }
];

// Selected courses
let selectedCourses = [];
const MAX_COURSES = 6;

// DOM Elements
const courseList = document.getElementById('course-list');
const selectedCount = document.getElementById('selected-count');
const departmentButtons = document.querySelectorAll('.dept-button');

// Initialize course display
function initializeCourses() {
    displayCourses('all');
    updateSelectedCount();
    initializeDepartmentFilters();
    initializeScheduleView();
}

// Format period display with actual times
function formatPeriodDisplay(period, day) {
    if (periodSchedule[period] && periodSchedule[period][day]) {
        return `Period ${period} (${periodSchedule[period][day]})`;
    } else if (period === "Athletics") {
        return "Athletics (3:00-5:00 p.m.)";
    } else {
        return `Period ${period}`;
    }
}

// Update schedule view when courses are selected/deselected
function updateScheduleView() {
    console.log("Updating schedule view with", selectedCourses.length, "selected courses");
    // Debug selected courses in detail
    if (selectedCourses.length > 0) {
        console.log("Selected courses details:");
        selectedCourses.forEach((course, index) => {
            console.log(`Course ${index + 1}: ${course.id} - ${course.name}`);
            console.log(`  Schedule:`, course.schedule);
            if (course.schedule && course.schedule.periods) {
                console.log(`  Periods:`, course.schedule.periods);
                console.log(`  Days:`, course.schedule.days);
            } else {
                console.log(`  WARNING: Course has no valid schedule data`);
            }
        });
    }
    
    try {
        // Get the schedule section first
        const scheduleSection = document.getElementById('schedule');
        if (!scheduleSection) {
            console.error("Schedule section not found - cannot update schedule");
            return;
        }
        
        // Get the schedule container within the section
        let scheduleContainer = scheduleSection.querySelector('.schedule-container');
        if (!scheduleContainer) {
            console.log("Creating missing schedule container");
            scheduleContainer = document.createElement('div');
            scheduleContainer.className = 'schedule-container';
            scheduleSection.appendChild(scheduleContainer);
        }
        
        // Add print button if not already added
        if (!scheduleContainer.querySelector('.print-schedule')) {
            console.log("Adding print schedule button");
            const printButton = document.createElement('button');
            printButton.className = 'primary-button print-schedule';
            printButton.innerHTML = '<i class="fas fa-print"></i> Print Schedule';
            printButton.addEventListener('click', () => {
                window.print();
            });
            
            scheduleContainer.appendChild(printButton);
        }
        
        // Get the schedule grid within the container
        let scheduleGrid = scheduleContainer.querySelector('.schedule-grid');
        if (!scheduleGrid) {
            console.log("Creating missing schedule grid");
            scheduleGrid = document.createElement('div');
            scheduleGrid.className = 'schedule-grid';
            scheduleContainer.appendChild(scheduleGrid);
        }
        
        // Clear the grid
    scheduleGrid.innerHTML = '';
        console.log("Cleared schedule grid");
        
        // If no courses are selected, show empty message and return
        if (!selectedCourses || selectedCourses.length === 0) {
            console.log("No courses selected, showing empty schedule message");
            scheduleGrid.innerHTML = '<div class="empty-schedule">No courses selected yet. Browse the course catalog to build your schedule.</div>';
            return;
        }
    
    // Create PA-style schedule header
    const scheduleHeader = document.createElement('div');
    scheduleHeader.className = 'schedule-header';
    scheduleHeader.innerHTML = '<h3>Phillips Academy Class Schedule</h3>';
    scheduleGrid.appendChild(scheduleHeader);
        console.log("Added schedule header");
    
    // Create schedule table
    const table = document.createElement('table');
    table.className = 'schedule-table';
    
    // Create header row with days
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Period/Time</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body with schedule
    const tbody = document.createElement('tbody');
    
        // Add period rows for all standard periods - using consistent naming for lunch periods
        // 4, 5, 6 will display as "Period 4 (Lunch)" etc.
        const periods = ["1", "2", "3", "4", "5", "6", "7"];
        console.log("Building schedule table with periods:", periods);
        
        // Debug the periodSchedule object
        console.log("periodSchedule object:", periodSchedule);
    
    periods.forEach(period => {
            console.log(`Creating row for period ${period}`);
        const periodRow = document.createElement('tr');
        
            // Time cell with period number
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        
            // Show lunch designation for lunch periods
            if (["4", "5", "6"].includes(period)) {
                timeCell.innerHTML = `Period ${period}<span class="lunch-indicator">(Lunch)</span>`;
            } else {
        timeCell.textContent = `Period ${period}`;
            }
        periodRow.appendChild(timeCell);
        
        // Day cells
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
            const dayCell = document.createElement('td');
                
                // Get period schedule - need to check both forms for lunch periods
                let periodTime = "";
                if (["4", "5", "6"].includes(period)) {
                    // Check both the numeric and (L) version
                    const lunchPeriod = `${period}(L)`;
                    periodTime = periodSchedule[period]?.[day] || periodSchedule[lunchPeriod]?.[day] || "";
                    console.log(`Period ${period} on ${day}: checking ${period} and ${lunchPeriod}, found time: "${periodTime}"`);
                } else {
                    periodTime = periodSchedule[period]?.[day] || "";
                    console.log(`Period ${period} on ${day}: time: "${periodTime}"`);
                }
            
            // Check if this period meets on this day
                if (periodTime && periodTime !== "") {
                // Set the time for this period on this day
                const timeSpan = document.createElement('span');
                timeSpan.className = 'period-time';
                    timeSpan.textContent = periodTime;
                dayCell.appendChild(timeSpan);
                
                    // Find matching courses that meet during this period and day
                const matchingCourses = selectedCourses.filter(course => {
                    if (!course.schedule || !course.schedule.periods || !course.schedule.days) {
                        return false;
                    }
                    
                        // Check if the period from the schedule matches the current period
                        let periodMatches = false;
                        if (period === "Athletics") {
                            periodMatches = course.schedule.periods.includes("Athletics");
                        } else {
                            const numericPeriod = parseInt(period);
                            const lunchPeriod = `${period}(L)`;
                            
                            // For lunch periods (4,5,6), course can have either format
                            if (["4", "5", "6"].includes(period)) {
                                periodMatches = course.schedule.periods.includes(numericPeriod) || 
                                               course.schedule.periods.includes(period) ||
                                               course.schedule.periods.includes(lunchPeriod);
                            } else {
                                periodMatches = course.schedule.periods.includes(numericPeriod) ||
                                               course.schedule.periods.includes(period);
                            }
                        }
                        
                        // Special handling for Monday periods 3, 4, 5, 6
                        // This ensures courses show up in Monday calendar slots
                        if (day === 'Monday' && (period === "3" || period === "4" || period === "5" || period === "6")) {
                            console.log(`Special check for ${course.id} on Monday period ${period}`);
                            // Check if the course is scheduled for this period - for Monday we don't check days
                            const coursePeriodsStr = course.schedule.periods.map(p => String(p));
                            if (coursePeriodsStr.includes(period) || coursePeriodsStr.includes(`${period}(L)`) || coursePeriodsStr.includes(parseInt(period))) {
                                console.log(`Found ${course.id} for Monday period ${period}!`);
                                return true;
                            }
                        }
                        
                        const dayMatches = course.schedule.days.includes(day);
                        console.log(`Checking course ${course.id} for period ${period} on ${day}: periodMatches=${periodMatches}, dayMatches=${dayMatches}`);
                        
                        return periodMatches && dayMatches;
                    });
                    
                    console.log(`Found ${matchingCourses.length} matching courses for period ${period} on ${day}`);
                
                // Add courses to the cell
                if (matchingCourses.length > 0) {
                    const coursesList = document.createElement('ul');
                    coursesList.className = 'period-courses';
                    
                    matchingCourses.forEach(course => {
                        const courseItem = document.createElement('li');
                        courseItem.textContent = course.id;
                        courseItem.title = course.name;
                        coursesList.appendChild(courseItem);
                            console.log(`Added course ${course.id} to period ${period} on ${day}`);
                    });
                    
                    dayCell.appendChild(coursesList);
                }
            } else {
                // Period doesn't meet on this day
                dayCell.className = 'inactive-period';
                dayCell.textContent = '—';
                    console.log(`Period ${period} doesn't meet on ${day}`);
            }
            
            periodRow.appendChild(dayCell);
        });
        
        tbody.appendChild(periodRow);
    });
    
    // Add athletics row
    const athleticsRow = document.createElement('tr');
    
    // Time cell for athletics (without time)
    const athleticsTimeCell = document.createElement('td');
    athleticsTimeCell.className = 'time-cell';
    athleticsTimeCell.textContent = 'Athletics';
    athleticsRow.appendChild(athleticsTimeCell);
    
    // Athletics cell spanning all days
    const athleticsCell = document.createElement('td');
    athleticsCell.className = 'athletics-cell';
    athleticsCell.setAttribute('colspan', '5');
    athleticsCell.textContent = 'Athletics and Community Engagement';
    athleticsRow.appendChild(athleticsCell);
    
    tbody.appendChild(athleticsRow);
    
    table.appendChild(tbody);
    
    // Create a wrapper for the table to enable horizontal scrolling
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'schedule-table-wrapper';
    tableWrapper.appendChild(table);
    
    // Add the wrapped table to the grid
    scheduleGrid.appendChild(tableWrapper);
        console.log("Added schedule table to the grid");
    
    // Add term schedule view
    const termScheduleDiv = document.createElement('div');
    termScheduleDiv.className = 'term-schedule';
    termScheduleDiv.innerHTML = '<h3>Term Overview</h3>';
    
    const terms = ['Fall (T1)', 'Winter (T2)', 'Spring (T3)'];
        console.log("Building term overview for terms:", terms);
    
    terms.forEach(term => {
            const termKey = term.toLowerCase().split(' ')[0];
            
            const termBlock = document.createElement('div');
            termBlock.className = 'term-block';
            
            // Add term header
            const termHeader = document.createElement('h4');
            termHeader.textContent = term;
            termBlock.appendChild(termHeader);
            
            // Add courses for this term
            let termCourses = selectedCourses.filter(course => 
                course.term === termKey || course.term === 'all'
            );
            
            // Sort courses by period number
            termCourses.sort((a, b) => {
                // Get the first period for each course
                const periodA = a.schedule && a.schedule.periods ? a.schedule.periods[0] : 0;
                const periodB = b.schedule && b.schedule.periods ? b.schedule.periods[0] : 0;
                
                // Convert to numbers for comparison (if not already numbers)
                const numA = typeof periodA === 'string' ? parseInt(periodA) || 999 : periodA;
                const numB = typeof periodB === 'string' ? parseInt(periodB) || 999 : periodB;
                
                return numA - numB;
            });
            
            const coursesContainer = document.createElement('div');
            coursesContainer.className = 'term-courses';
            
            if (termCourses.length > 0) {
                termCourses.forEach(course => {
                    const courseItem = document.createElement('div');
                    courseItem.className = 'term-course-item';
                    
                    const courseId = document.createElement('span');
                    courseId.className = 'term-course-id';
                    courseId.textContent = course.id;
                    courseItem.appendChild(courseId);
                    
                    courseItem.append(` - ${course.name}`);
                    
                    const coursePeriods = document.createElement('div');
                    coursePeriods.className = 'course-periods';
                    coursePeriods.innerHTML = `<small>${course.schedule ? `Period ${course.schedule.periods[0]}` : ''}</small>`;
                    courseItem.appendChild(coursePeriods);
                    
                    coursesContainer.appendChild(courseItem);
                });
            } else {
                const emptyTerm = document.createElement('div');
                emptyTerm.className = 'empty-term';
                emptyTerm.textContent = 'No courses selected for this term';
                coursesContainer.appendChild(emptyTerm);
            }
            
            termBlock.appendChild(coursesContainer);
            
            // Add term stats
            const termStats = document.createElement('div');
            termStats.className = 'term-stats';
            
            const countItem = document.createElement('div');
            countItem.className = 'term-stats-item';
            countItem.textContent = `Total Courses: ${termCourses.length}`;
            termStats.appendChild(countItem);
            
            termBlock.appendChild(termStats);
            termScheduleDiv.appendChild(termBlock);
        });
        
        scheduleGrid.appendChild(termScheduleDiv);
        console.log("Added term overview to the grid");
    
    // Update graduation requirements progress
    updateRequirementsProgress();
        
        // Make sure the schedule section is visible if it's the active section
        if (scheduleSection.classList.contains('active-section')) {
            console.log("Schedule section is active, ensuring it remains visible");
            scheduleSection.style.display = 'block';
        }
        
        console.log("Schedule view update complete");
    } catch (error) {
        console.error("Error updating schedule view:", error);
        console.error("Error stack:", error.stack);
    }
}

// Format course periods for display
function formatCoursePeriods(course) {
    if (!course.schedule || !course.schedule.periods || !course.schedule.days) {
        return '';
    }
    
    // Create a formatted string that shows periods and days
    let periodsDisplay = [];
    
    course.schedule.periods.forEach(period => {
        let periodDays = [];
        
        // Check each day
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
            if (course.schedule.days.includes(day)) {
                periodDays.push(day.substring(0, 3)); // First 3 letters of day
            }
        });
        
        // Format as "Period X (Mon, Wed, Fri)"
        periodsDisplay.push(`Period ${period} (${periodDays.join(', ')})`);
    });
    
    return periodsDisplay.join('; ');
}

// Find courses that match a specific time block and day
function findCoursesForTimeAndDay(timeBlock, day) {
    return selectedCourses.filter(course => {
        if (!course.schedule || !course.schedule.periods || !course.schedule.days.includes(day)) {
            return false;
        }
        
        // Check each period of the course
        return course.schedule.periods.some(period => {
            // Skip athletics for regular time blocks
            if (period === "Athletics") {
                return timeBlock === "3:00-5:00 p.m.";
            }
            
            // Check if the period exists for this day
            if (!periodSchedule[period] || !periodSchedule[period][day]) {
                return false;
            }
            
            // Get the time range for this period on this day
            const periodTime = periodSchedule[period][day];
            
            // Simple check - does the time block appear in the period time
            // A more sophisticated check would parse and compare actual times
            return periodTime.includes(timeBlock.replace(' a.m.', '').replace(' p.m.', ''));
        });
    });
}

function updateRequirementsProgress() {
    // This is a simplified implementation
    // In a real application, this would analyze the selected courses against the graduation requirements
    
    // Example: Calculate English progress
    const englishCourses = selectedCourses.filter(course => course.department === 'english');
    const englishProgress = document.querySelector('.requirement-card:nth-child(1) .progress');
    const englishProgressText = document.querySelector('.requirement-card:nth-child(1) .progress-text');
    
    if (englishCourses.length > 0) {
        // Assuming 12 terms of English are required (4 years × 3 terms)
        const progress = Math.min(englishCourses.length / 12 * 100, 100);
        englishProgress.style.width = `${progress}%`;
        englishProgressText.textContent = `${englishCourses.length}/12 completed`;
    }
    
    // Update other requirements similarly
    // This is simplified for demonstration
}

// Initialize schedule view
function initializeScheduleView() {
    console.log("Initializing schedule view");
    
    try {
        // Find or create the schedule section
        let scheduleSection = document.getElementById('schedule');
        if (!scheduleSection) {
            console.error("Schedule section not found - cannot initialize schedule view");
            return;
        }
        
        // Make sure the section has the proper heading
        if (!scheduleSection.querySelector('h2')) {
            const heading = document.createElement('h2');
            heading.textContent = 'My Schedule';
            scheduleSection.prepend(heading);
        }
        
        // Find or create the schedule container
        let scheduleContainer = scheduleSection.querySelector('.schedule-container');
        if (!scheduleContainer) {
            console.log("Creating missing schedule container");
            scheduleContainer = document.createElement('div');
            scheduleContainer.className = 'schedule-container';
            scheduleSection.appendChild(scheduleContainer);
        }
        
        // Add print button if it doesn't exist
        if (!scheduleContainer.querySelector('.print-schedule')) {
            console.log("Adding print schedule button");
    const printButton = document.createElement('button');
    printButton.className = 'primary-button print-schedule';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Schedule';
    printButton.addEventListener('click', () => {
        window.print();
    });
    
            scheduleContainer.appendChild(printButton);
        }
        
        // Find or create the schedule grid
        let scheduleGrid = scheduleContainer.querySelector('.schedule-grid');
        if (!scheduleGrid) {
            console.log("Creating missing schedule grid");
            scheduleGrid = document.createElement('div');
            scheduleGrid.className = 'schedule-grid';
            scheduleContainer.appendChild(scheduleGrid);
        }
        
        // Show empty message if no courses selected
        if (!selectedCourses || selectedCourses.length === 0) {
            console.log("No courses selected, showing empty schedule message");
            scheduleGrid.innerHTML = '<div class="empty-schedule">No courses selected yet. Browse the course catalog to build your schedule.</div>';
        }
        
        // Set the schedule section to be visible if it's the active section
        if (scheduleSection.classList.contains('active-section')) {
            console.log("Schedule section is active, ensuring it is visible");
            scheduleSection.style.display = 'block';
        }
    } catch (error) {
        console.error("Error in initializeScheduleView:", error);
        // If there's an error, try the fallback method
        createSimpleScheduleView();
    }
}

// Display courses based on department filter
function displayCourses(department) {
    courseList.innerHTML = '';
    
    // Apply all active filters
    const termFilter = document.getElementById('term-filter').value;
    const levelFilter = document.getElementById('level-filter').value;
    const periodFilter = document.getElementById('period-filter').value;
    const searchQuery = document.getElementById('course-search').value.toLowerCase();
    
    // IMPORTANT: Only use courses that have the spring2025 flag - ignore the hard-coded courses array
    let filteredCourses = courses.filter(course => course.spring2025 === true);
    console.log(`Found ${filteredCourses.length} Spring 2025 courses`);
    
    // Department filter
    if (department !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.department === department);
        console.log(`After department filter: ${filteredCourses.length} courses`);
    }
    
    // Level filter
    if (levelFilter !== 'all') {
        const levelNum = parseInt(levelFilter);
        filteredCourses = filteredCourses.filter(course => Math.floor(course.level / 100) * 100 === levelNum);
        console.log(`After level filter: ${filteredCourses.length} courses`);
    }
    
    // Period filter (for the period-based system)
    if (periodFilter !== 'all') {
        filteredCourses = filteredCourses.filter(course => {
            if (!course.schedule || !course.schedule.periods) return false;
            
            // Handle different period formats
            if (periodFilter === "Athletics") {
                return course.schedule.periods.includes("Athletics");
            } else {
                const periodNum = parseInt(periodFilter);
                const periodWithL = periodFilter.includes('(L)') ? periodFilter : null;
                
                return course.schedule.periods.some(p => {
                    if (typeof p === 'number') return p === periodNum;
                    if (typeof p === 'string') {
                        if (p === periodFilter) return true;
                        if (periodWithL && p === periodWithL) return true;
                        if (parseInt(p) === periodNum) return true;
                    }
                    return false;
                });
            }
        });
        console.log(`After period filter: ${filteredCourses.length} courses`);
    }
    
    // Search query
    if (searchQuery) {
        filteredCourses = filteredCourses.filter(course => 
            course.name.toLowerCase().includes(searchQuery) || 
            course.id.toLowerCase().includes(searchQuery) || 
            course.description.toLowerCase().includes(searchQuery) ||
            (course.instructor && course.instructor.toLowerCase().includes(searchQuery)) ||
            (course.room && course.room.toLowerCase().includes(searchQuery))
        );
        console.log(`After search: ${filteredCourses.length} courses`);
    }

    // Sort courses by department and level
    filteredCourses.sort((a, b) => {
        // Sort by department
        if (a.department < b.department) return -1;
        if (a.department > b.department) return 1;
        
        // Then by level
        return a.level - b.level;
    });
    
    // Display courses
    filteredCourses.forEach(course => {
        const isSelected = selectedCourses.some(selected => selected.id === course.id);
        const courseCard = createCourseCard(course, isSelected);
        courseList.appendChild(courseCard);
    });
    
    // Show message if no courses match filters
    if (filteredCourses.length === 0) {
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.textContent = 'No Spring 2025 courses match your current filters. Please try adjusting your search criteria.';
        courseList.appendChild(noResultsMsg);
    }
    
    // Update active filters display
    updateActiveFilters();
}

// Create a course card element - modify this function to add scrolling to option lists
function createCourseCard(course, isSelected) {
    const card = document.createElement('div');
    card.className = 'dashboard-card';
    
    // Format prerequisites if they exist
    const prereqsText = course.prerequisites ? 
        `<p><strong>Prerequisites:</strong> ${course.prerequisites.join(', ')}</p>` : '';
    
    // Format lab science indicator if applicable
    const labScienceText = course.labScience ? 
        '<p><span class="tag lab-science">Lab Science</span></p>' : '';
    
    // Format credit information
    const creditText = course.credits === 1 ? '1 term' : `${course.credits} terms`;
    
    // Format teacher options if available (for consolidated Spring 2025 courses)
    let teacherOptionsText = '';
    if (course.teacherOptions && course.teacherOptions.length > 0) {
        teacherOptionsText = `
            <div class="teacher-options">
                <h4>Available Sections: (${course.teacherOptions.length})</h4>
                <div class="options-container">
                    <ul class="options-list scrollable-list">
                    ${course.teacherOptions.map(option => 
                        `<li>
                                <span class="option-section">§${option.section}:</span> 
                            ${option.instructor} (Room: ${option.room})
                        </li>`
                    ).join('')}
                </ul>
                </div>
            </div>
        `;
    }
    
    // Format period options if available (for consolidated Spring 2025 courses)
    let periodOptionsText = '';
    if (course.periodOptions && course.periodOptions.length > 0) {
        periodOptionsText = `
            <div class="period-options">
                <h4>Available Periods: (${course.periodOptions.length})</h4>
                <div class="options-container">
                    <ul class="options-list scrollable-list">
                    ${course.periodOptions.map(option => 
                        `<li>
                            <label class="period-option">
                                <input type="radio" name="period-${course.id}" 
                                       data-course-id="${course.id}"
                                       data-period="${option.period}"
                                       data-days="${option.days.join(',')}"
                                       ${course.selectedPeriod === option.period ? 'checked' : ''}
                                       class="period-selector">
                                Period ${option.period} 
                                (${option.days.map(day => day.substring(0, 3)).join(', ')})
                            </label>
                        </li>`
                    ).join('')}
                </ul>
                </div>
            </div>
        `;
    }
    
    // Format period information
    const periodsText = course.schedule && course.schedule.periods ? 
        formatCoursePeriods(course) : 'Schedule information not available';
    
    // Add Spring 2025 tag if applicable
    const spring2025Tag = course.spring2025 ? 
        '<span class="tag spring-2025-tag">Spring 2025</span>' : '';
    
    // Add instructor info if available and not showing teacher options
    const instructorText = course.instructor && !course.teacherOptions ? 
        `<p><strong>Instructor:</strong> ${course.instructor}</p>` : '';
    
    // Add room info if available and not showing teacher options
    const roomText = course.room && !course.teacherOptions ? 
        `<p><strong>Room:</strong> ${course.room}</p>` : '';
    
    card.innerHTML = `
        <div class="course-header">
        <h3>${course.name}</h3>
        <p class="course-id">${course.id}</p>
            <p class="term-designation"><strong>Term:</strong> ${course.termDesignation} ${spring2025Tag}</p>
            <p><strong>Credits:</strong> ${creditText}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            ${instructorText}
            ${roomText}
            ${labScienceText}
            ${prereqsText}
            <p class="course-description">${course.description}</p>
            <button class="secondary-button details-toggle">
                <i class="fas fa-chevron-down"></i> View Schedule & Options
            </button>
        </div>
        <div class="course-details collapsed">
            <p><strong>Schedule:</strong> ${periodsText}</p>
            ${teacherOptionsText}
            ${periodOptionsText}
        </div>
        <button class="secondary-button course-select-btn ${isSelected ? 'selected' : ''}" 
                data-course-id="${course.id}">
            ${isSelected ? 'Remove Course' : 'Add Course'}
        </button>
    `;

    // Add event listener for the toggle button
    const toggleButton = card.querySelector('.details-toggle');
    const courseDetails = card.querySelector('.course-details');
    
    toggleButton.addEventListener('click', () => {
        // Toggle the collapsed class
        courseDetails.classList.toggle('collapsed');
        
        // Update button text and icon
        if (courseDetails.classList.contains('collapsed')) {
            toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i> View Schedule & Options';
        } else {
            toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Schedule & Options';
        }
    });

    const button = card.querySelector('.course-select-btn');
    button.addEventListener('click', () => toggleCourseSelection(course, button));

    // Add event listeners for period selectors
    card.querySelectorAll('.period-selector').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const courseId = this.dataset.courseId;
                const periodValue = this.dataset.period;
                const daysArray = this.dataset.days.split(',');
                
                // Find the course in the courses array
                const courseToUpdate = courses.find(c => c.id === courseId);
                if (courseToUpdate) {
                    // Store the selected period
                    courseToUpdate.selectedPeriod = periodValue;
                    
                    // Update the course's schedule
                    courseToUpdate.schedule = {
                        periods: [periodValue === "Athletics" ? periodValue : parseInt(periodValue.replace('(L)', ''))],
                        days: daysArray
                    };
                    
                    // If this course is already selected, update selectedCourses as well
                    const selectedCourseIndex = selectedCourses.findIndex(c => c.id === courseId);
                    if (selectedCourseIndex >= 0) {
                        selectedCourses[selectedCourseIndex].schedule = courseToUpdate.schedule;
                        // Update the schedule view to reflect the new period
                        updateScheduleView();
                    }
                    
                    console.log(`Selected Period ${periodValue} for course ${courseId}`);
                }
            }
        });
    });

    return card;
}

// Format period number for display
function formatPeriodForDisplay(period) {
    // Convert to string if it's a number
    const periodStr = typeof period === 'number' ? period.toString() : period;
    
    // For periods 4, 5, 6 add the lunch indicator
    if (['4', '5', '6'].includes(periodStr)) {
        return `Period ${periodStr} (Lunch)`;
    }
    
    // If already has (L), replace with more user-friendly format
    if (periodStr.includes('(L)')) {
        return `Period ${periodStr.replace('(L)', '')} (Lunch)`;
    }
    
    return `Period ${periodStr}`;
}

// Show a course schedule conflict modal with updated period display
function showConflictModal(conflicts, course) {
    // Remove any existing modal
    const existingModal = document.querySelector('.conflict-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'conflict-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'conflict-modal-content';
    
    // Set modal title
    const modalTitle = document.createElement('h3');
    modalTitle.className = 'conflict-modal-title';
    modalTitle.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Schedule Conflict Detected';
    modalContent.appendChild(modalTitle);
    
    // Modal message
    const modalMessage = document.createElement('p');
    modalMessage.textContent = `Cannot add ${course.id}: ${course.name} due to the following schedule conflicts:`;
    modalContent.appendChild(modalMessage);
    
    // Create conflict list
    const conflictList = document.createElement('ul');
    conflictList.className = 'conflict-list';
    
    conflicts.forEach(conflict => {
        const listItem = document.createElement('li');
        listItem.className = 'conflict-item';
        
        const courseEl = document.createElement('div');
        courseEl.className = 'conflict-course';
        courseEl.textContent = `${conflict.course.id}: ${conflict.course.name}`;
        
        const periods = conflict.periods.map(p => formatPeriodForDisplay(p)).join(', ');
        const days = conflict.days.join(', ');
        
        const detailsEl = document.createElement('div');
        detailsEl.className = 'conflict-details';
        detailsEl.textContent = `Conflicts on ${days} during ${periods}`;
        
        listItem.appendChild(courseEl);
        listItem.appendChild(detailsEl);
        conflictList.appendChild(listItem);
    });
    
    modalContent.appendChild(conflictList);
    
    // Add suggestion message
    const suggestion = document.createElement('p');
    suggestion.textContent = 'Please remove conflicting courses before adding this one.';
    modalContent.appendChild(suggestion);
    
    // Add close button
    const closeButton = document.createElement('div');
    closeButton.className = 'conflict-modal-footer';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'primary-button close-conflict-modal';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    closeButton.appendChild(closeBtn);
    modalContent.appendChild(closeButton);
    
    // Add modal to body
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Function to standardize period representations for conflict checking
function standardizePeriod(period) {
    // Convert to string if it's a number
    const periodStr = typeof period === 'number' ? period.toString() : period;
    
    // For lunch periods, remove the (L) designation
    if (periodStr.includes('(L)')) {
        return periodStr.replace('(L)', '');
    }
    
    return periodStr;
}

// Update toggleCourseSelection to ensure proper schedule updates with correct data format
function toggleCourseSelection(course, button) {
    // Only allow Spring 2025 courses to be selected
    if (!course.spring2025) {
        alert("Only Spring 2025 courses can be selected for registration.");
        return;
    }
    
    const isSelected = selectedCourses.some(selected => selected.id === course.id);
    let courseChanged = false;
    
    if (isSelected) {
        // Remove from selection
        selectedCourses = selectedCourses.filter(selected => selected.id !== course.id);
        button.textContent = 'Add Course';
        button.classList.remove('selected');
        courseChanged = true;
        console.log(`Removed course ${course.id} from selection`);
    } else {
        // Check if max courses reached
        if (selectedCourses.length >= MAX_COURSES) {
            alert(`You can only select up to ${MAX_COURSES} courses. Please remove a course before adding another.`);
            return;
        }
        
        // Check if adding this course would violate the lunch block rule
        // Users can only select 2 out of the 3 lunch blocks (periods 4, 5, 6)
        if (course.schedule && course.schedule.periods) {
            // Is this a lunch period course?
            const isLunchPeriod = course.schedule.periods.some(p => {
                const periodStr = typeof p === 'string' ? p : p.toString();
                return periodStr === '4' || periodStr === '5' || periodStr === '6' || 
                       periodStr === '4(L)' || periodStr === '5(L)' || periodStr === '6(L)';
            });
            
            if (isLunchPeriod) {
                // Count currently selected lunch periods
                // We need to identify which specific lunch period this course uses
                const currentLunchPeriod = course.schedule.periods.find(p => {
                    const periodStr = typeof p === 'string' ? p : p.toString();
                    return periodStr === '4' || periodStr === '5' || periodStr === '6' || 
                           periodStr === '4(L)' || periodStr === '5(L)' || periodStr === '6(L)';
                });
                
                // Normalize the current lunch period to a simple number (4, 5, or 6)
                const normalizedCurrentPeriod = String(currentLunchPeriod).replace('(L)', '');
                
                // Get already selected lunch periods (as normalized numbers)
                const selectedLunchPeriods = new Set();
                selectedCourses.forEach(c => {
                    if (c.schedule && c.schedule.periods) {
                        c.schedule.periods.forEach(p => {
                            const periodStr = typeof p === 'string' ? p : p.toString();
                            if (periodStr === '4' || periodStr === '5' || periodStr === '6' || 
                                periodStr === '4(L)' || periodStr === '5(L)' || periodStr === '6(L)') {
                                selectedLunchPeriods.add(periodStr.replace('(L)', ''));
                            }
                        });
                    }
                });
                
                console.log(`Selected lunch periods: ${Array.from(selectedLunchPeriods).join(', ')}`);
                console.log(`Trying to add lunch period: ${normalizedCurrentPeriod}`);
                
                // If we already have 2 unique lunch periods and trying to add a third different one
                if (selectedLunchPeriods.size >= 2 && !selectedLunchPeriods.has(normalizedCurrentPeriod)) {
                    alert("You can only select 2 out of the 3 lunch blocks (periods 4, 5, and 6). Please remove a lunch period course before adding another.");
                    return;
                }
            }
        }
        
        // Check for period conflicts before adding
        if (course.schedule && course.schedule.periods && course.schedule.days) {
            const conflicts = [];
            
            // Loop through each selected course to check for conflicts
            selectedCourses.forEach(selectedCourse => {
                // Skip courses without scheduling info
                if (!selectedCourse.schedule || !selectedCourse.schedule.periods || !selectedCourse.schedule.days) {
                    return;
                }
                
                // Check for overlapping days
                const overlappingDays = course.schedule.days.filter(day => 
                    selectedCourse.schedule.days.includes(day)
                );
                
                if (overlappingDays.length > 0) {
                    // Check for overlapping periods on those days
                    // Standardize periods to handle Period 4 and Period 4(L) as the same
                    const coursePeriods = course.schedule.periods.map(p => standardizePeriod(p));
                    const selectedPeriods = selectedCourse.schedule.periods.map(p => standardizePeriod(p));
                    
                    // Check for overlapping periods
                    const overlappingPeriods = coursePeriods.filter(period =>
                        selectedPeriods.includes(period)
                    );
                    
                    if (overlappingPeriods.length > 0) {
                        conflicts.push({
                            course: selectedCourse,
                            days: overlappingDays,
                            periods: overlappingPeriods
                        });
                    }
                }
            });
            
            if (conflicts.length > 0) {
                // Show the conflict modal instead of an alert
                showConflictModal(conflicts, course);
                return;
            }
        }
        
        // Create a deep copy of the course to add to selected courses
        const courseCopy = JSON.parse(JSON.stringify(course));
        
        // Ensure course has valid schedule data
        if (!courseCopy.schedule) {
            courseCopy.schedule = {
                periods: [courseCopy.selectedPeriod || "1"],
                days: ["Monday", "Wednesday", "Friday"]
            };
            console.log(`Created default schedule for course ${courseCopy.id}`);
        }
        
        // Ensure periods is an array of numbers for numeric periods
        if (courseCopy.schedule.periods) {
            courseCopy.schedule.periods = courseCopy.schedule.periods.map(p => {
                if (p === "Athletics") return p;
                if (typeof p === 'string' && p.includes('(L)')) return p;
                return typeof p === 'string' ? parseInt(p) : p;
            });
            console.log(`Normalized period format for course ${courseCopy.id}:`, courseCopy.schedule.periods);
        }
        
        // Add to selection
        selectedCourses.push(courseCopy);
        button.textContent = 'Remove Course';
        button.classList.add('selected');
        courseChanged = true;
        console.log(`Added course ${course.id} to selection with schedule:`, courseCopy.schedule);
    }
    
    if (courseChanged) {
        // Update selected count
    updateSelectedCount();
        
        // Always update the schedule view, regardless of which section is visible
        console.log(`Course selection changed, updating schedule view (${selectedCourses.length} courses selected)`);
        
        // First make sure schedule view is initialized
        initializeScheduleView();
        // Then update it with the current courses
    updateScheduleView();
        
        // Check if the schedule section is currently visible, and make sure it stays visible
        const scheduleSection = document.getElementById('schedule');
        if (scheduleSection && scheduleSection.classList.contains('active-section')) {
            console.log("Schedule section is active, ensuring it stays visible");
            // Force it to remain active
            scheduleSection.style.display = 'block';
        }
    
    // Refresh all course cards to update selection status
    displayCourses(document.querySelector('.dept-button.active').dataset.dept);
    }
}

// Update the selected courses count
function updateSelectedCount() {
    selectedCount.textContent = selectedCourses.length;
}

// Initialize department filter buttons
function initializeDepartmentFilters() {
    console.log("Initializing department filters");
    
    // Find all department buttons
    const departmentButtons = document.querySelectorAll('.dept-button');
    
    departmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(`Department button clicked: ${this.dataset.dept}`);
            
            // Remove active class from all buttons
            departmentButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Display courses for the selected department
            displayCourses(this.dataset.dept);
        });
    });
    
    // Initialize search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log("Search button clicked");
        displayCourses(document.querySelector('.dept-button.active').dataset.dept);
    });
    }
    
    // Initialize search input for Enter key
    const courseSearch = document.getElementById('course-search');
    if (courseSearch) {
        courseSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
                console.log("Enter key pressed in search input");
            displayCourses(document.querySelector('.dept-button.active').dataset.dept);
        }
    });
    }
    
    // Initialize dropdown filters
    ['level-filter', 'period-filter'].forEach(filterId => {
        const filterElement = document.getElementById(filterId);
        if (filterElement) {
            filterElement.addEventListener('change', () => {
                console.log(`Filter changed: ${filterId}`);
            displayCourses(document.querySelector('.dept-button.active').dataset.dept);
        });
        }
    });
    
    console.log("Department filters initialized");
}

// Update the active filters display
function updateActiveFilters() {
    const activeFiltersDiv = document.getElementById('active-filters');
    activeFiltersDiv.innerHTML = '';
    
    const searchTerm = document.getElementById('course-search').value;
    const selectedTerm = document.getElementById('term-filter').options[document.getElementById('term-filter').selectedIndex].text;
    const selectedLevel = document.getElementById('level-filter').options[document.getElementById('level-filter').selectedIndex].text;
    const selectedPeriod = document.getElementById('period-filter').options[document.getElementById('period-filter').selectedIndex].text;
    const selectedDept = document.querySelector('.dept-button.active').textContent;
    
    const filters = [];
    
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (selectedTerm !== 'All Terms') filters.push(selectedTerm);
    if (selectedLevel !== 'All Levels') filters.push(selectedLevel);
    if (selectedPeriod !== 'All Periods') filters.push(selectedPeriod);
    if (selectedDept !== 'All') filters.push(`Department: ${selectedDept}`);
    
    if (filters.length > 0) {
        const filterText = document.createElement('p');
        filterText.innerHTML = '<strong>Active Filters:</strong> ' + filters.join(' | ');
        activeFiltersDiv.appendChild(filterText);
        
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-filters-btn';
        clearButton.textContent = 'Clear All Filters';
        clearButton.addEventListener('click', clearAllFilters);
        activeFiltersDiv.appendChild(clearButton);
    }
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('course-search').value = '';
    document.getElementById('term-filter').value = 'all';
    document.getElementById('level-filter').value = 'all';
    document.getElementById('period-filter').value = 'all';
    
    document.querySelectorAll('.dept-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.dept-button[data-dept="all"]').classList.add('active');
    
    displayCourses('all');
}

// Function to load Spring 2025 course data
async function loadSpring2025Data() {
    try {
        const response = await fetch('Spring 2025 Course Listing.csv');
        const data = await response.text();
        
        // Create a more prominent Spring 2025 banner instead of a notification
        const coursesSection = document.getElementById('courses');
        const existingBanner = document.querySelector('.spring-2025-banner');
        
        if (!existingBanner) {
            const banner = document.createElement('div');
            banner.className = 'spring-2025-banner';
            banner.innerHTML = `
                <h3><i class="fas fa-calendar-alt"></i> Spring 2025 Registration Now Open</h3>
                <p>Welcome to the Spring 2025 course registration portal. All available courses are listed below.</p>
            `;
            
            coursesSection.insertBefore(banner, coursesSection.querySelector('.search-filters'));
        }
        
        // Parse the Spring 2025 course data and import into the main catalog
        importSpring2025Courses(data);
        
        // Initialize the Spring 2025 table view with CSV data
        initializeSpring2025Table(data);
        
        console.log('Spring 2025 course data loaded successfully');
    } catch (error) {
        console.error('Error loading Spring 2025 course data:', error);
    }
}

// Import Spring 2025 courses into the main course catalog
function importSpring2025Courses(csvData) {
    // Split CSV into lines
    const rows = csvData.split('\n');
    
    // Find the actual data starting row (skip header rows)
    let dataStartIndex = 0;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes('Section,Course,Staff,Room,Period,Required Alternates?')) {
            dataStartIndex = i + 1;
            break;
        }
    }
    
    // Parse CSV line function
    const parseCsvLine = (line) => {
        const result = [];
        let inQuotes = false;
        let currentField = '';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        
        result.push(currentField); // Add the last field
        return result;
    };
    
    // Map to store consolidated courses by course code
    const courseMap = new Map();
    
    // Process each row
    for (let i = dataStartIndex; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row || row.startsWith('ROOM,BUILDING') || row === ',,,,,') continue; // Skip empty rows and building info
        
        // Parse the CSV row
        const fields = parseCsvLine(row);
        
        if (fields.length >= 5) {
            // Process course information
            const section = fields[0] || '';
            const courseInfo = fields[1] || '';
            const instructor = fields[2] || 'Staff';
            const room = fields[3] || 'TBA';
            const period = fields[4] || '';
            const alternates = fields[5] || '';
            
            // Skip if no course info
            if (!courseInfo) continue;
            
            // Extract course code and name
            const courseMatch = courseInfo.match(/([A-Z]+\d+[A-Z]*)\s*:\s*(.*)/);
            if (!courseMatch) continue;
            
            const courseCode = courseMatch[1];
            const courseName = courseMatch[2];
            
            // Use just the course code for consolidated courses
            const courseId = courseCode;
            
            // Determine department from course code
            const deptCode = courseCode.match(/^[A-Z]+/)[0].toLowerCase();
            let department;
            
            // Map department codes to department names
            switch (deptCode) {
                case 'art': department = 'art'; break;
                case 'bio': department = 'science'; break;
                case 'chm': department = 'science'; break;
                case 'phy': department = 'science'; break;
                case 'sci': department = 'science'; break;
                case 'eng': department = 'english'; break;
                case 'hss': department = 'history'; break;
                case 'mth': department = 'math'; break;
                case 'mus': department = 'music'; break;
                case 'phr': department = 'philosophy'; break;
                case 'phd': department = 'pe'; break;
                case 'thd': department = 'theatre'; break;
                case 'chi':
                case 'fre':
                case 'ger':
                case 'jpn':
                case 'ltn':
                case 'rus':
                case 'spa': department = 'language'; break;
                case 'csc': department = 'science'; break; // Computer Science
                default: department = 'other';
            }
            
            // Convert level from course code (e.g., BIO100 -> 100)
            const levelMatch = courseCode.match(/\d+/);
            const level = levelMatch ? parseInt(levelMatch[0]) : 0;
            
            // Convert period format
            const periodNumber = parseInt(period);
            let periodFormatted;
            
            if (isNaN(periodNumber)) {
                periodFormatted = "Athletics"; // Special case
            } else if (periodNumber >= 4 && periodNumber <= 6) {
                periodFormatted = `${periodNumber}(L)`; // Lunch periods
            } else {
                periodFormatted = periodNumber;
            }
            
            // Determine meeting days based on Phillips Academy schedule
            // Simplified for clarity
            let days = [];
            if (periodNumber === 1 || periodNumber === 2 || periodNumber === 7) {
                days = ['Monday', 'Wednesday', 'Friday']; // Common MWF pattern
            } else if (periodNumber === 3 || periodNumber === 4 || periodNumber === 5 || periodNumber === 6) {
                days = ['Tuesday', 'Thursday']; // Common TTh pattern
            } else {
                days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; 
            }
            
            // Create or update course in the map
            if (courseMap.has(courseId)) {
                // Update existing course with new section option
                const existingCourse = courseMap.get(courseId);
                
                // Add this teacher if not already in the list
                if (!existingCourse.teacherOptions.some(t => t.instructor === instructor)) {
                    existingCourse.teacherOptions.push({
                        instructor: instructor,
                        room: room,
                        section: section
                    });
                }
                
                // Add this period if not already in the list
                if (!existingCourse.periodOptions.some(p => p.period === periodFormatted)) {
                    existingCourse.periodOptions.push({
                        period: periodFormatted,
                        days: days
                    });
                }
                
                // Update the course description to include all teachers
                existingCourse.description = `${courseName} (Spring 2025). Available with: ${existingCourse.teacherOptions.map(t => t.instructor).join(', ')}.`;
            } else {
                // Create a new consolidated course
                courseMap.set(courseId, {
                    id: courseId,
                    name: courseName,
                    department: department,
                    description: `${courseName} (Spring 2025). Taught by ${instructor} in ${room}.`,
                    credits: 1,
                    term: 'spring', // Spring term only
                    level: level,
                    schedule: {
                        periods: [periodFormatted],
                        days: days
                    },
                    requirements: [department],
                    instructor: instructor, // Primary instructor
                    maxEnrollment: 15, // Default value
                    currentEnrollment: Math.floor(Math.random() * 10) + 1, // Random value for demonstration
                    termDesignation: 'T3', // Spring term
                    room: room,
                    section: section,
                    spring2025: true, // Mark as a Spring 2025 course
                    teacherOptions: [{
                        instructor: instructor,
                        room: room,
                        section: section
                    }],
                    periodOptions: [{
                        period: periodFormatted,
                        days: days
                    }],
                    selectedPeriod: periodFormatted // Store the currently selected period
                });
            }
        }
    }
    
    // Add the consolidated courses to the main catalog
    courseMap.forEach(course => {
        // Don't add if already in courses array
        if (!courses.some(c => c.id === course.id && c.spring2025)) {
            courses.push(course);
        }
    });
    
    console.log(`Imported ${courseMap.size} unique courses from Spring 2025 listing`);
}

// Function to initialize the Spring 2025 table view
function initializeSpring2025Table(csvData) {
    const tableContainer = document.querySelector('.spring-2025-table-container');
    tableContainer.style.display = 'block'; // Ensure it's displayed by default
    
    // Get the table view container
    const tableContainer2 = document.getElementById('spring-2025-table');
    
    // Create a table to display the data
    const table = document.createElement('table');
    table.className = 'spring-2025-table';
    
    // Set up the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Section</th>
        <th>Course</th>
        <th>Instructor</th>
        <th>Room</th>
        <th>Period</th>
        <th>Alternates Required</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // The rest of the function stays the same
    // ... existing code ...
}

// Set up event listeners for Spring 2025 filters
function initializeSpring2025Filters() {
    const deptFilter = document.getElementById('spring-2025-dept-filter');
    const periodFilter = document.getElementById('spring-2025-period-filter');
    const toggleButton = document.getElementById('toggle-spring-2025-view');
    const tableContainer = document.querySelector('.spring-2025-table-container');
    const tableView = document.getElementById('spring-2025-table');
    const searchInput = document.getElementById('spring-2025-search');
    const searchButton = document.getElementById('spring-2025-search-btn');
    
    // Toggle view button
    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('active');
        tableView.style.display = tableView.style.display === 'none' ? 'block' : 'none';
        tableContainer.style.display = 'block'; // Always show the container
    });
    
    // Department filter
    deptFilter.addEventListener('change', filterSpring2025Table);
    
    // Period filter
    periodFilter.addEventListener('change', filterSpring2025Table);
    
    // Search functionality
    searchButton.addEventListener('click', filterSpring2025Table);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterSpring2025Table();
        }
    });
}

// Filter the Spring 2025 table based on selected filters
function filterSpring2025Table() {
    const deptFilter = document.getElementById('spring-2025-dept-filter').value;
    const periodFilter = document.getElementById('spring-2025-period-filter').value;
    const searchQuery = document.getElementById('spring-2025-search').value.toLowerCase();
    const rows = document.querySelectorAll('.spring-2025-table tbody tr');
    
    rows.forEach(row => {
        const deptMatch = deptFilter === 'all' || row.dataset.courseCode === deptFilter;
        const periodMatch = periodFilter === 'all' || row.dataset.period === periodFilter;
        
        // Search in course code, name, and instructor
        const courseCode = row.querySelector('.course-code')?.textContent.toLowerCase() || '';
        const courseName = row.querySelector('.course-name')?.textContent.toLowerCase() || '';
        const instructor = row.querySelector('.instructor-name')?.textContent.toLowerCase() || '';
        
        const searchMatch = searchQuery === '' || 
            courseCode.includes(searchQuery) || 
            courseName.includes(searchQuery) || 
            instructor.includes(searchQuery);
        
        // Show row only if all filters match
        row.style.display = deptMatch && periodMatch && searchMatch ? '' : 'none';
    });
    
    // Show a message if no results
    const table = document.querySelector('.spring-2025-table');
    let noResultsMsg = table.querySelector('.no-results-message');
    
    // Count visible rows
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
    
    if (visibleRows === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('tr');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `<td colspan="6">No courses match your filter criteria. Try adjusting your filters.</td>`;
            table.querySelector('tbody').appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, initializing application");
    
    // Verify periodSchedule object is defined
    if (!periodSchedule || typeof periodSchedule !== 'object') {
        console.error("periodSchedule object is not defined properly");
        // Create a default periodSchedule if needed
        window.periodSchedule = {
            // Default schedule definition...
        };
        console.log("Created default periodSchedule object");
    } else {
        console.log("periodSchedule object is correctly defined");
    }
    
    // Initialize Spring 2025 courses - these should be the only courses shown
    loadSpring2025Data();
    
    // Filter out any non-Spring 2025 courses that might be in the selection
    selectedCourses = selectedCourses.filter(course => course.spring2025 === true);
    updateSelectedCount();
    
    // Make Spring 2025 the main page by default
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
        section.style.display = 'none';
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to courses link
    document.querySelector('a[href="#courses"]').classList.add('active');
    
    // Show courses section
    const coursesSection = document.getElementById('courses');
    coursesSection.classList.add('active-section');
    coursesSection.style.display = 'block';
    
    // Initialize department filters and search functionality
    initializeDepartmentFilters();
    
    // Add event listener for Review Selection button to navigate to My Schedule
    const reviewSelectionBtn = document.querySelector('.dashboard-card .primary-button');
    if (reviewSelectionBtn) {
        reviewSelectionBtn.addEventListener('click', () => {
            console.log("Review Selection button clicked, navigating to My Schedule");
            
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active-section');
                section.style.display = 'none';
            });
            
            // Remove active class from all nav links
            document.querySelectorAll('nav ul li a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to schedule link
            document.querySelector('a[href="#schedule"]').classList.add('active');
            
            // Show schedule section
            const scheduleSection = document.getElementById('schedule');
            scheduleSection.classList.add('active-section');
            scheduleSection.style.display = 'block';
            
            // Create/update the schedule view
            try {
                initializeScheduleView();
                updateScheduleView();
            } catch (error) {
                console.error("Error in standard schedule view methods:", error);
                // Use the simple method as fallback
                if (!document.querySelector('.schedule-table')) {
                    createSimpleScheduleView();
                }
            }
        });
    }
    
    // Wait for a moment to ensure course data is loaded
    setTimeout(() => {
        console.log("Setting up course display");
        
        // Only show Spring 2025 courses
        displayCourses('all');
        
        // Remove term filter since we're only showing Spring 2025 courses
        const termFilterContainer = document.querySelector('.filter-group:has(#term-filter)');
        if (termFilterContainer) {
            termFilterContainer.style.display = 'none';
        }
        
        console.log("Course display initialization complete");
    }, 500); // Increased timeout to ensure data is loaded
    
    // Add the scrollable list styles
    addScrollableListStyles();
});

// Add a safety fallback method to display the schedule without complex dependencies
function createSimpleScheduleView() {
    console.log("Creating simple schedule view as a fallback");
    
    // Get the schedule section
    const scheduleSection = document.getElementById('schedule');
    if (!scheduleSection) {
        console.error("Schedule section not found - cannot create simple schedule");
        return;
    }
    
    // Clear any existing content
    scheduleSection.innerHTML = '<h2>My Schedule</h2>';
    
    // Create a container for the schedule
    const container = document.createElement('div');
    container.className = 'schedule-container';
    scheduleSection.appendChild(container);
    
    // Add print button
    const printButton = document.createElement('button');
    printButton.className = 'primary-button print-schedule';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Schedule';
    printButton.addEventListener('click', () => {
        window.print();
    });
    container.appendChild(printButton);
    
    // Create a basic schedule grid
    const grid = document.createElement('div');
    grid.className = 'schedule-grid';
    container.appendChild(grid);
    
    // Add header
    const header = document.createElement('div');
    header.className = 'schedule-header';
    header.innerHTML = '<h3>Phillips Academy Class Schedule</h3>';
    grid.appendChild(header);
    
    // If no courses are selected, show empty message
    if (!selectedCourses || selectedCourses.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-schedule';
        emptyMessage.textContent = 'No courses selected yet. Browse the course catalog to build your schedule.';
        grid.appendChild(emptyMessage);
        return;
    }
    
    // Create a simple table for the schedule
    const table = document.createElement('table');
    table.className = 'schedule-table';
    
    // Add header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Period</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add rows for periods 1-7
    for (let period = 1; period <= 7; period++) {
        const row = document.createElement('tr');
        
        // Period cell
        const periodCell = document.createElement('td');
        periodCell.className = 'time-cell';
        periodCell.textContent = `Period ${period}`;
        if (period >= 4 && period <= 6) {
            periodCell.innerHTML += '<span class="lunch-indicator">(Lunch)</span>';
        }
        row.appendChild(periodCell);
        
        // Day cells
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
            const dayCell = document.createElement('td');
            
            // Find courses for this period and day
            const periodCourses = selectedCourses.filter(course => {
                if (!course.schedule || !course.schedule.periods || !course.schedule.days) {
                    return false;
                }
                
                const hasMatchingPeriod = course.schedule.periods.includes(period) || 
                                          course.schedule.periods.includes(`${period}(L)`) ||
                                          course.schedule.periods.includes(String(period));
                                          
                const hasMatchingDay = course.schedule.days.includes(day);
                
                return hasMatchingPeriod && hasMatchingDay;
            });
            
            // Add courses to the cell
            if (periodCourses.length > 0) {
                const list = document.createElement('ul');
                list.className = 'period-courses';
                
                periodCourses.forEach(course => {
                    const item = document.createElement('li');
                    item.textContent = course.id;
                    item.title = course.name;
                    list.appendChild(item);
                });
                
                dayCell.appendChild(list);
            } else {
                dayCell.className = 'inactive-period';
                dayCell.textContent = '—';
            }
            
            row.appendChild(dayCell);
        });
        
        tbody.appendChild(row);
    }
    
    // Add athletics row
    const athleticsRow = document.createElement('tr');
    
    // Athletics period cell
    const athleticsCell = document.createElement('td');
    athleticsCell.className = 'time-cell';
    athleticsCell.textContent = 'Athletics';
    athleticsRow.appendChild(athleticsCell);
    
    // Athletics span cell
    const athleticsSpan = document.createElement('td');
    athleticsSpan.className = 'athletics-cell';
    athleticsSpan.setAttribute('colspan', '5');
    athleticsSpan.textContent = 'Athletics and Community Engagement';
    athleticsRow.appendChild(athleticsSpan);
    
    tbody.appendChild(athleticsRow);
    table.appendChild(tbody);
    
    // Create table wrapper for horizontal scrolling
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'schedule-table-wrapper';
    tableWrapper.appendChild(table);
    
    // Append the wrapper to the grid instead of the table directly
    grid.appendChild(tableWrapper);
    
    // Add term overview
    const termOverview = document.createElement('div');
    termOverview.className = 'term-schedule';
    termOverview.innerHTML = '<h3>Term Overview</h3>';
    
    // Create term blocks
    ['Fall (T1)', 'Winter (T2)', 'Spring (T3)'].forEach(term => {
        const termKey = term.toLowerCase().split(' ')[0];
        
        const termBlock = document.createElement('div');
        termBlock.className = 'term-block';
        
        // Add term header
        const termHeader = document.createElement('h4');
        termHeader.textContent = term;
        termBlock.appendChild(termHeader);
        
        // Add courses for this term
        let termCourses = selectedCourses.filter(course => 
            course.term === termKey || course.term === 'all'
        );
        
        // Sort courses by period number
        termCourses.sort((a, b) => {
            // Get the first period for each course
            const periodA = a.schedule && a.schedule.periods ? a.schedule.periods[0] : 0;
            const periodB = b.schedule && b.schedule.periods ? b.schedule.periods[0] : 0;
            
            // Convert to numbers for comparison (if not already numbers)
            const numA = typeof periodA === 'string' ? parseInt(periodA) || 999 : periodA;
            const numB = typeof periodB === 'string' ? parseInt(periodB) || 999 : periodB;
            
            return numA - numB;
        });
        
        const coursesContainer = document.createElement('div');
        coursesContainer.className = 'term-courses';
        
        if (termCourses.length > 0) {
            termCourses.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.className = 'term-course-item';
                
                const courseId = document.createElement('span');
                courseId.className = 'term-course-id';
                courseId.textContent = course.id;
                courseItem.appendChild(courseId);
                
                courseItem.append(` - ${course.name}`);
                
                const coursePeriods = document.createElement('div');
                coursePeriods.className = 'course-periods';
                coursePeriods.innerHTML = `<small>${course.schedule ? `Period ${course.schedule.periods[0]}` : ''}</small>`;
                courseItem.appendChild(coursePeriods);
                
                coursesContainer.appendChild(courseItem);
            });
        } else {
            const emptyTerm = document.createElement('div');
            emptyTerm.className = 'empty-term';
            emptyTerm.textContent = 'No courses selected for this term';
            coursesContainer.appendChild(emptyTerm);
        }
        
        termBlock.appendChild(coursesContainer);
        
        // Add term stats
        const termStats = document.createElement('div');
        termStats.className = 'term-stats';
        
        const countItem = document.createElement('div');
        countItem.className = 'term-stats-item';
        countItem.textContent = `Total Courses: ${termCourses.length}`;
        termStats.appendChild(countItem);
        
        termBlock.appendChild(termStats);
        termOverview.appendChild(termBlock);
    });
    
    grid.appendChild(termOverview);
    console.log("Simple schedule view created successfully");
}

// Add this function to your script.js file
function addScrollableListStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Base styles for all option containers */
        .options-container {
            overflow-y: auto;
            overflow-x: hidden;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            margin: 8px 0;
            background-color: #f9f9f9;
            position: relative;
        }
        
        /* Highly condensed teacher options */
        .teacher-options .options-container {
            max-height: 120px; /* Much smaller height for sections */
            padding: 2px 4px; /* Minimal padding */
        }
        
        /* Sections should be very compact */
        .teacher-options .scrollable-list li {
            padding: 2px 4px; /* Minimal padding */
            margin-bottom: 1px;
            font-size: 0.85em; /* Smaller font size */
            line-height: 1.2; /* Tighter line height */
            white-space: nowrap; /* Prevent wrapping for more compact display */
            overflow: hidden;
            text-overflow: ellipsis; /* Add ellipsis for long text */
        }
        
        /* Make section headings smaller */
        .teacher-options h4 {
            margin: 2px 0 4px 0;
            font-size: 0.9em;
            color: #555;
        }
        
        /* Optimize layout for teacher options */
        .option-section {
            font-weight: 600;
            font-size: 0.9em;
        }
        
        /* More spacious period options */
        .period-options .options-container {
            max-height: 240px; /* Increased height for period options */
            padding: 6px; /* More padding for better readability */
        }
        
        /* Period options styling */
        .period-options .scrollable-list li {
            padding: 8px 6px; /* More padding for better clickability */
            margin-bottom: 3px;
        }
        
        /* Make period options more readable */
        .period-option {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }
        
        /* More prominent period options heading */
        .period-options h4 {
            margin: 4px 0 8px 0;
            font-size: 1em;
            font-weight: 600;
            color: #333;
        }
        
        /* More visible scroll indicators for period options */
        .period-options .options-container::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 15px;
            background: linear-gradient(to top, rgba(249,249,249,1), rgba(249,249,249,0));
            pointer-events: none;
            opacity: 1;
        }
        
        /* Better scrollbars styling */
        .options-container::-webkit-scrollbar {
            width: 6px;
        }
        
        .teacher-options .options-container::-webkit-scrollbar {
            width: 4px; /* Smaller scrollbar for teacher sections */
        }
        
        .period-options .options-container::-webkit-scrollbar {
            width: 8px; /* Larger scrollbar for periods */
        }
        
        .options-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        
        .options-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        
        /* Basic list styling */
        .scrollable-list {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
        
        .options-list li {
            border-bottom: 1px solid #eee;
        }
        
        .options-list li:last-child {
            border-bottom: none;
            padding-bottom: 10px; /* Extra padding at bottom for scroll visibility */
        }
        
        /* Remove whitespace between buttons */
        .course-details.collapsed {
            max-height: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            border: none;
        }
        
        /* Adjust button spacing */
        .details-toggle {
            margin-bottom: 0 !important;
        }
        
        .course-select-btn {
            margin-top: 6px !important;
        }
        
        /* Dashboard card adjustments */
        .dashboard-card {
            display: flex;
            flex-direction: column;
        }
        
        /* Ensure last items in periods list are fully visible */
        .period-options .options-list li:last-child {
            padding-bottom: 16px;
        }
    `;
    document.head.appendChild(styleElement);
}

// Add a function to improve section layout and display
function enhanceSectionDisplay() {
    // Run after cards are rendered
    setTimeout(() => {
        // Make teacher sections more compact by formatting them
        document.querySelectorAll('.teacher-options .options-list li').forEach(item => {
            // Get the current HTML content
            const content = item.innerHTML;
            
            // Format it to be more compact
            // Extract section number, instructor, and room
            const sectionMatch = content.match(/Section\s+(.+?):/i);
            const sectionNum = sectionMatch ? sectionMatch[1] : '';
            
            const roomMatch = content.match(/\(Room:\s*(.+?)\)/i);
            const room = roomMatch ? roomMatch[1] : '';
            
            // Get instructor name (everything between the section colon and the room parenthesis)
            let instructor = '';
            if (content.indexOf(':') > -1 && content.indexOf('(Room:') > -1) {
                instructor = content.substring(
                    content.indexOf(':') + 1, 
                    content.indexOf('(Room:')
                ).trim();
            }
            
            // Create more compact display
            if (sectionNum && instructor) {
                item.innerHTML = `
                    <span class="option-section">§${sectionNum}:</span> 
                    <span class="option-instructor">${instructor}</span>
                    <span class="option-room">${room ? `(${room})` : ''}</span>
                `;
                
                // Add tooltip for full information
                item.title = `Section ${sectionNum}: ${instructor} (Room: ${room})`;
            }
        });
        
        // Add clearer labeling to period options
        document.querySelectorAll('.period-options .options-list li').forEach(item => {
            const radio = item.querySelector('input[type="radio"]');
            if (radio && !radio.id) {
                // Create a unique ID for better accessibility
                const uniqueId = `period-${radio.dataset.courseId}-${radio.dataset.period}`;
                radio.id = uniqueId;
                
                // Get the label text
                const labelText = item.textContent.trim();
                
                // Wrap in proper label tag if needed
                if (!item.querySelector('label[for]')) {
                    const label = document.createElement('label');
                    label.setAttribute('for', uniqueId);
                    label.textContent = labelText;
                    
                    // Clear the item content and add the properly linked label
                    item.innerHTML = '';
                    item.appendChild(radio);
                    item.appendChild(label);
                }
            }
        });
    }, 300);
}

// Update the createCourseCard function to make sections more condensed
function modifyCreateCourseCard() {
    // Store the original function
    const originalCreateCourseCard = window.createCourseCard;
    
    // Replace with our modified version
    window.createCourseCard = function(course, isSelected) {
        // Call the original function to get the card
        const card = originalCreateCourseCard(course, isSelected);
        
        // Modify the structure to make sections more condensed
        const teacherOptions = card.querySelector('.teacher-options');
        if (teacherOptions) {
            const heading = teacherOptions.querySelector('h4');
            if (heading) {
                // Update the heading to be more compact
                const sectionCount = course.teacherOptions ? course.teacherOptions.length : 0;
                heading.innerHTML = `Sections (${sectionCount})`;
            }
        }
        
        // Make period options more prominent
        const periodOptions = card.querySelector('.period-options');
        if (periodOptions) {
            const heading = periodOptions.querySelector('h4');
            if (heading) {
                // Emphasize period options
                const periodCount = course.periodOptions ? course.periodOptions.length : 0;
                heading.innerHTML = `Available Periods (${periodCount})`;
                heading.style.fontWeight = 'bold';
            }
        }
        
        // Apply enhancements after card is created
        setTimeout(() => enhanceSectionDisplay(), 100);
        
        return card;
    };
}

// Call these functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addScrollableListStyles();
    modifyCreateCourseCard();
    
    // Set a timer to check periodically for new cards
    setInterval(enhanceSectionDisplay, 1000);
});
