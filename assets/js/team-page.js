/**
 * Team page integration
 * Handles team members listing
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize team page
        if (window.location.pathname.includes('team.html')) {
            initializeTeamPage();
        }
    } catch (error) {
        console.error('Error initializing team page:', error);
    }
});

/* ============================
   Team Page
=============================== */
async function initializeTeamPage() {
    try {
        const teamMembers = await ApiService.getTeamMembers();
        
        // Only show active team members
        const activeMembers = teamMembers.filter(member => member.isActive);
        
        updatePageTitle('Team Members');
        displayTeamMembers(activeMembers);
    } catch (error) {
        console.error('Error loading team page:', error);
    }
}

function updatePageTitle(title) {
    const pageTitleElement = document.querySelector('.page-title-content h2');
    if (pageTitleElement) pageTitleElement.textContent = title;

    const breadcrumbElement = document.querySelector('.page-title-content ul li:last-child');
    if (breadcrumbElement) breadcrumbElement.textContent = title;
}

function displayTeamMembers(members) {
    const teamContainer = document.querySelector('.team-area .row');
    if (!teamContainer) return;

    // Clear existing team members
    teamContainer.innerHTML = '';

    if (members.length === 0) {
        const noMembersMsg = document.createElement('div');
        noMembersMsg.className = 'col-12 text-center';
        noMembersMsg.innerHTML = '<p>No team members available at the moment.</p>';
        teamContainer.appendChild(noMembersMsg);
        return;
    }
    
    members.forEach((member, index) => {
        const memberCol = document.createElement('div');
        memberCol.className = 'col-lg-4 col-md-6';
        // Add AOS animation with increasing delay based on index
        memberCol.setAttribute('data-aos', 'fade-up');
        memberCol.setAttribute('data-aos-delay', (200 + (index * 100)).toString());

        // Create social media links based on available data
        const socialLinks = `
            ${member.email ? `<a href="mailto:${member.email}" class="social-color-1"><i class="fas fa-envelope"></i></a>` : ''}
            ${member.phone ? `<a href="tel:${member.phone}" class="social-color-2"><i class="fas fa-phone"></i></a>` : ''}
            ${member.whatsapp ? `<a href="https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}" class="social-color-3"><i class="fab fa-whatsapp"></i></a>` : ''}
        `;

        memberCol.innerHTML = `
            <div class="single-team-box">
                <div class="team-image">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="team-social-icon">
                        ${socialLinks}
                    </div>
                </div>
                <div class="team-info">
                    <h3>${member.name}</h3>
                    <span>${member.position}</span>
                </div>
            </div>
        `;
        teamContainer.appendChild(memberCol);
    });
}