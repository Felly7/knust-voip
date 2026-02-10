/**
 * Mock Data for Reports Dashboard
 * Emulates data structure expected from report_queries.sql
 */

const reportsData = {
    // 1. Phone Status Overview
    phoneStatus: {
        active: 1450,
        inactive: 120,
        total: 1570
    },

    // 2. Department Usage (Top 5)
    departmentUsage: [
        { name: "College of Engineering", count: 450 },
        { name: "College of Science", count: 320 },
        { name: "Central Administration", count: 280 },
        { name: "Health Sciences", count: 210 },
        { name: "Humanities & Social Sciences", count: 150 }
    ],

    // 3. Recent Activity (Mock Logs)
    recentActivity: [
        { id: 101, action: "New Extension Added", details: "Ext 2045 - Dr. Amponsah", time: "2 hours ago" },
        { id: 102, action: "Department Updated", details: "Finance Office", time: "5 hours ago" },
        { id: 103, action: "Report Generated", details: "Monthly Usage", time: "1 day ago" },
        { id: 104, action: "System Alert", details: "Database Backup Complete", time: "1 day ago" }
    ],

    // 4. Distribution by Unit Type
    unitDistribution: {
        academic: 60,
        administrative: 25,
        service: 10,
        residential: 5
    }
};

// Function to simulate API fetch
function fetchReportsData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(reportsData);
        }, 800); // Simulate network delay
    });
}
