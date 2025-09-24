// AI Learning Path Generator - Main Application Logic
class AILearningApp {
    constructor() {
        this.currentUser = null;
        this.currentStep = 1;
        this.totalSteps = 6;
        this.onboardingData = {};
        this.learningPath = null;
        this.cohereApiKey = 'mKnrBFhXCn5tIRSTDBf84zuPLc60i2BswNE6gT15';
        
        // Sample data
        this.badges = [
            {id: "first_path", name: "Path Pioneer", description: "Created your first learning path", icon: "🎯"},
            {id: "week_complete", name: "Week Warrior", description: "Completed a full week of learning", icon: "📚"},
            {id: "streak_7", name: "Week Streak", description: "Maintained a 7-day learning streak", icon: "🔥"},
            {id: "streak_30", name: "Monthly Master", description: "Maintained a 30-day learning streak", icon: "💪"},
            {id: "fast_learner", name: "Speed Demon", description: "Completed 3 topics in one day", icon: "⚡"},
            {id: "completionist", name: "Path Finisher", description: "Completed an entire learning path", icon: "🏆"}
        ];
        
        this.avatars = [
            {id: "mentor_ai", name: "AI Assistant", image: "🤖", personality: "Helpful and encouraging"},
            {id: "mentor_wise", name: "Wise Owl", image: "🦉", personality: "Thoughtful and patient"},
            {id: "mentor_energetic", name: "Energy Cat", image: "😸", personality: "Energetic and motivating"},
            {id: "mentor_zen", name: "Zen Master", image: "🧘", personality: "Calm and focused"}
        ];
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.checkAuthStatus();
    }
    
    setupEventListeners() {
        // Navigation
        const authBtn = document.getElementById('authBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        if (authBtn) authBtn.addEventListener('click', () => this.showAuthModal());
        if (getStartedBtn) getStartedBtn.addEventListener('click', () => this.showAuthModal());
        if (learnMoreBtn) learnMoreBtn.addEventListener('click', () => this.showToast('More info coming soon!', 'info'));
        
        // Auth modal
        const closeAuthModal = document.getElementById('closeAuthModal');
        const authOverlay = document.getElementById('authOverlay');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (closeAuthModal) closeAuthModal.addEventListener('click', () => this.hideAuthModal());
        if (authOverlay) authOverlay.addEventListener('click', () => this.hideAuthModal());
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToRegister();
            });
        }
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }
        
        // Google auth buttons
        const googleLogin = document.getElementById('googleLogin');
        const googleRegister = document.getElementById('googleRegister');
        
        if (googleLogin) googleLogin.addEventListener('click', () => this.handleGoogleAuth());
        if (googleRegister) googleRegister.addEventListener('click', () => this.handleGoogleAuth());
        
        // Form submissions
        const emailLoginForm = document.getElementById('emailLoginForm');
        const emailRegisterForm = document.getElementById('emailRegisterForm');
        
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailLogin();
            });
        }
        if (emailRegisterForm) {
            emailRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailRegister();
            });
        }
        
        // Onboarding
        const nextStep = document.getElementById('nextStep');
        const prevStep = document.getElementById('prevStep');
        const generatePath = document.getElementById('generatePath');
        
        if (nextStep) nextStep.addEventListener('click', () => this.nextOnboardingStep());
        if (prevStep) prevStep.addEventListener('click', () => this.prevOnboardingStep());
        if (generatePath) generatePath.addEventListener('click', () => this.generateLearningPath());
        
        // Dashboard
        const logoutBtn = document.getElementById('logoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const viewPathBtn = document.getElementById('viewPathBtn');
        const backToDashboard = document.getElementById('backToDashboard');
        
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        if (profileBtn) profileBtn.addEventListener('click', () => this.showProfile());
        if (viewPathBtn) viewPathBtn.addEventListener('click', () => this.showPathView());
        if (backToDashboard) backToDashboard.addEventListener('click', () => this.showDashboard());
        
        // Setup onboarding options
        this.setupOnboardingOptions();
    }
    
    setupOnboardingOptions() {
        // Skill level options
        document.querySelectorAll('.skill-option').forEach(option => {
            option.addEventListener('click', () => this.selectSkillLevel(option));
        });
        
        // Subject selection
        document.querySelectorAll('.subject-item').forEach(item => {
            item.addEventListener('click', () => this.toggleSubject(item));
        });
        
        // Time commitment options
        document.querySelectorAll('.time-option').forEach(option => {
            option.addEventListener('click', () => this.selectTimeCommitment(option));
        });
        
        // Learning style options
        document.querySelectorAll('.style-option').forEach(option => {
            option.addEventListener('click', () => this.selectLearningStyle(option));
        });
        
        // Avatar selection
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', () => this.selectAvatar(option));
        });
    }
    
    // Authentication methods
    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    switchToRegister() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.getElementById('authTitle');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        if (authTitle) authTitle.textContent = 'Create Account';
    }
    
    switchToLogin() {
        const registerForm = document.getElementById('registerForm');
        const loginForm = document.getElementById('loginForm');
        const authTitle = document.getElementById('authTitle');
        
        if (registerForm) registerForm.classList.add('hidden');
        if (loginForm) loginForm.classList.remove('hidden');
        if (authTitle) authTitle.textContent = 'Welcome Back';
    }
    
    handleGoogleAuth() {
        // Simulate Google OAuth
        const userData = {
            id: 'google_' + Date.now(),
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatar: 'mentor_ai',
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            completedWeeks: 0,
            joinDate: new Date().toISOString(),
            hasCompletedOnboarding: false
        };
        
        this.currentUser = userData;
        this.saveUserData();
        this.hideAuthModal();
        this.showToast('Welcome! Let\'s set up your learning profile.', 'success');
        this.startOnboarding();
    }
    
    handleEmailLogin() {
        const emailElement = document.getElementById('loginEmail');
        const passwordElement = document.getElementById('loginPassword');
        
        if (!emailElement || !passwordElement) {
            this.showToast('Login form not found.', 'error');
            return;
        }
        
        const email = emailElement.value;
        const password = passwordElement.value;
        
        // Simulate login - in real app, this would call an API
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = savedUsers.find(u => u.email === email);
        
        if (user) {
            this.currentUser = user;
            this.saveUserData();
            this.hideAuthModal();
            this.showToast('Welcome back!', 'success');
            
            if (user.hasCompletedOnboarding) {
                this.showDashboard();
            } else {
                this.startOnboarding();
            }
        } else {
            this.showToast('Invalid credentials. Try creating an account first.', 'error');
        }
    }
    
    handleEmailRegister() {
        const nameElement = document.getElementById('registerName');
        const emailElement = document.getElementById('registerEmail');
        const passwordElement = document.getElementById('registerPassword');
        
        if (!nameElement || !emailElement || !passwordElement) {
            this.showToast('Registration form not found.', 'error');
            return;
        }
        
        const name = nameElement.value;
        const email = emailElement.value;
        const password = passwordElement.value;
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long.', 'error');
            return;
        }
        
        const userData = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            avatar: 'mentor_ai',
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            completedWeeks: 0,
            joinDate: new Date().toISOString(),
            hasCompletedOnboarding: false
        };
        
        // Save to localStorage (simulating user database)
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        savedUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(savedUsers));
        
        this.currentUser = userData;
        this.saveUserData();
        this.hideAuthModal();
        this.showToast('Account created successfully!', 'success');
        this.startOnboarding();
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLanding();
        this.showToast('Logged out successfully.', 'info');
    }
    
    // Onboarding methods
    startOnboarding() {
        this.hideLanding();
        this.showOnboarding();
        this.currentStep = 1;
        this.updateOnboardingProgress();
    }
    
    nextOnboardingStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateOnboardingStep();
            this.updateOnboardingProgress();
        }
    }
    
    prevOnboardingStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateOnboardingStep();
            this.updateOnboardingProgress();
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                const userNameElement = document.getElementById('userName');
                if (!userNameElement) return false;
                
                const userName = userNameElement.value.trim();
                if (!userName) {
                    this.showToast('Please enter your name.', 'error');
                    return false;
                }
                this.onboardingData.name = userName;
                break;
            case 2:
                if (!this.onboardingData.skillLevel) {
                    this.showToast('Please select your skill level.', 'error');
                    return false;
                }
                break;
            case 3:
                if (!this.onboardingData.subjects || this.onboardingData.subjects.length === 0) {
                    this.showToast('Please select at least one subject.', 'error');
                    return false;
                }
                break;
            case 4:
                if (!this.onboardingData.timeCommitment) {
                    this.showToast('Please select your time commitment.', 'error');
                    return false;
                }
                break;
            case 5:
                if (!this.onboardingData.learningStyle) {
                    this.showToast('Please select your learning style.', 'error');
                    return false;
                }
                break;
            case 6:
                if (!this.onboardingData.avatar) {
                    this.showToast('Please select your AI mentor.', 'error');
                    return false;
                }
                break;
        }
        return true;
    }
    
    updateOnboardingStep() {
        document.querySelectorAll('.onboarding-step').forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update button states
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const generateBtn = document.getElementById('generatePath');
        
        if (prevBtn) prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            if (nextBtn) nextBtn.classList.add('hidden');
            if (generateBtn) generateBtn.classList.remove('hidden');
        } else {
            if (nextBtn) nextBtn.classList.remove('hidden');
            if (generateBtn) generateBtn.classList.add('hidden');
        }
    }
    
    updateOnboardingProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressElement = document.getElementById('onboardingProgress');
        const progressTextElement = document.getElementById('progressText');
        
        if (progressElement) progressElement.style.width = progress + '%';
        if (progressTextElement) progressTextElement.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
    
    // Onboarding selection methods
    selectSkillLevel(option) {
        document.querySelectorAll('.skill-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this.onboardingData.skillLevel = option.dataset.value;
    }
    
    toggleSubject(item) {
        item.classList.toggle('selected');
        
        if (!this.onboardingData.subjects) {
            this.onboardingData.subjects = [];
        }
        
        const subject = item.dataset.value;
        const index = this.onboardingData.subjects.indexOf(subject);
        
        if (index > -1) {
            this.onboardingData.subjects.splice(index, 1);
        } else {
            this.onboardingData.subjects.push(subject);
        }
    }
    
    selectTimeCommitment(option) {
        document.querySelectorAll('.time-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this.onboardingData.timeCommitment = option.dataset.value;
    }
    
    selectLearningStyle(option) {
        document.querySelectorAll('.style-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this.onboardingData.learningStyle = option.dataset.value;
    }
    
    selectAvatar(option) {
        document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this.onboardingData.avatar = option.dataset.value;
    }
    
    // AI Learning Path Generation
    async generateLearningPath() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.hideOnboarding();
        this.showLoadingScreen();
        
        try {
            // Update loading messages
            const loadingMessages = [
                "Analyzing your preferences...",
                "Curating the best resources...",
                "Building your personalized roadmap...",
                "Adding finishing touches..."
            ];
            
            for (let i = 0; i < loadingMessages.length; i++) {
                await this.sleep(1500);
                const loadingTextElement = document.getElementById('loadingText');
                if (loadingTextElement) {
                    loadingTextElement.textContent = loadingMessages[i];
                }
            }
            
            // Generate learning path using Cohere API
            const learningPath = await this.callCohereAPI();
            
            // Update user data
            this.currentUser.name = this.onboardingData.name;
            this.currentUser.skillLevel = this.onboardingData.skillLevel;
            this.currentUser.subjects = this.onboardingData.subjects;
            this.currentUser.timeCommitment = this.onboardingData.timeCommitment;
            this.currentUser.learningStyle = this.onboardingData.learningStyle;
            this.currentUser.avatar = this.onboardingData.avatar;
            this.currentUser.hasCompletedOnboarding = true;
            this.currentUser.learningPath = learningPath;
            
            // Award first path badge
            this.awardBadge('first_path');
            
            this.saveUserData();
            this.hideLoadingScreen();
            this.showDashboard();
            this.showToast('Your personalized learning path has been created! 🎉', 'success');
            
        } catch (error) {
            console.error('Error generating learning path:', error);
            this.hideLoadingScreen();
            this.showOnboarding();
            this.showToast('Failed to generate learning path. Please try again.', 'error');
        }
    }
    
    async callCohereAPI() {
        const prompt = this.buildLearningPathPrompt();
        
        try {
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.cohereApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'command',
                    prompt: prompt,
                    max_tokens: 2000,
                    temperature: 0.7,
                    k: 0,
                    stop_sequences: [],
                    return_likelihoods: 'NONE'
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseLearningPathResponse(data.generations[0].text);
            
        } catch (error) {
            console.error('Cohere API error:', error);
            // Return fallback learning path
            return this.getFallbackLearningPath();
        }
    }
    
    buildLearningPathPrompt() {
        const { skillLevel, subjects, timeCommitment, learningStyle } = this.onboardingData;
        
        return `Create a detailed personalized learning path for a ${skillLevel} level learner who wants to learn ${subjects.join(', ')}. 
        
        Requirements:
        - Time commitment: ${timeCommitment}
        - Learning style: ${learningStyle}
        - Include 8-12 weekly modules
        - Each week should have 3-5 specific topics
        - Include practical projects for each week
        - Suggest free resources like documentation, tutorials, and courses
        - Provide estimated hours per week
        - Make it engaging and progressive
        
        Format the response as a structured learning path with:
        - Overall title and duration
        - Difficulty level
        - Week-by-week breakdown with topics, resources, and projects
        
        Focus on practical, hands-on learning with clear milestones.`;
    }
    
    parseLearningPathResponse(responseText) {
        try {
            // Parse the AI response and structure it
            const lines = responseText.split('\n').filter(line => line.trim());
            const path = {
                title: '',
                duration: '',
                difficulty: this.onboardingData.skillLevel,
                weeks: []
            };
            
            // Extract title and basic info
            const titleMatch = lines.find(line => line.toLowerCase().includes('learning path') || line.toLowerCase().includes('course'));
            if (titleMatch) {
                path.title = titleMatch.replace(/[#*\-]/g, '').trim();
            } else {
                path.title = `${this.onboardingData.subjects[0]} Mastery Path`;
            }
            
            // Determine duration based on time commitment
            const durationMap = {
                '2-5 hours/week': '16 weeks',
                '5-10 hours/week': '12 weeks',
                '10-15 hours/week': '10 weeks',
                '15+ hours/week': '8 weeks'
            };
            path.duration = durationMap[this.onboardingData.timeCommitment] || '12 weeks';
            
            // Generate weeks based on response
            const weekCount = parseInt(path.duration);
            for (let i = 1; i <= Math.min(weekCount, 12); i++) {
                path.weeks.push({
                    week: i,
                    title: this.generateWeekTitle(i, this.onboardingData.subjects[0]),
                    topics: this.generateWeekTopics(i, this.onboardingData.subjects[0]),
                    resources: this.generateWeekResources(this.onboardingData.learningStyle),
                    project: this.generateWeekProject(i, this.onboardingData.subjects[0]),
                    hours: this.calculateWeeklyHours(this.onboardingData.timeCommitment),
                    completed: false
                });
            }
            
            return path;
            
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return this.getFallbackLearningPath();
        }
    }
    
    getFallbackLearningPath() {
        const subject = this.onboardingData.subjects[0] || 'Web Development';
        
        return {
            title: `${subject} Mastery Path`,
            duration: '12 weeks',
            difficulty: this.onboardingData.skillLevel,
            weeks: [
                {
                    week: 1,
                    title: 'Foundations & Setup',
                    topics: ['Environment Setup', 'Basic Concepts', 'Tools Introduction'],
                    resources: ['Official Documentation', 'Getting Started Tutorial', 'Setup Guide'],
                    project: 'Create your first "Hello World" project',
                    hours: this.calculateWeeklyHours(this.onboardingData.timeCommitment),
                    completed: false
                },
                {
                    week: 2,
                    title: 'Core Fundamentals',
                    topics: ['Variables & Data Types', 'Control Structures', 'Functions'],
                    resources: ['Interactive Tutorials', 'Practice Exercises', 'Video Course'],
                    project: 'Build a simple calculator application',
                    hours: this.calculateWeeklyHours(this.onboardingData.timeCommitment),
                    completed: false
                },
                {
                    week: 3,
                    title: 'Intermediate Concepts',
                    topics: ['Object-Oriented Programming', 'Error Handling', 'File Operations'],
                    resources: ['Advanced Tutorial Series', 'Code Examples', 'Best Practices Guide'],
                    project: 'Create a task management system',
                    hours: this.calculateWeeklyHours(this.onboardingData.timeCommitment),
                    completed: false
                }
            ]
        };
    }
    
    generateWeekTitle(week, subject) {
        const titles = {
            1: 'Foundations & Setup',
            2: 'Core Fundamentals',
            3: 'Intermediate Concepts',
            4: 'Advanced Topics',
            5: 'Practical Applications',
            6: 'Project Development',
            7: 'Optimization & Testing',
            8: 'Deployment & Production',
            9: 'Advanced Features',
            10: 'Performance & Scaling',
            11: 'Best Practices',
            12: 'Capstone Project'
        };
        return titles[week] || `Week ${week} - Advanced ${subject}`;
    }
    
    generateWeekTopics(week, subject) {
        // Generate relevant topics based on week and subject
        const baseTopics = [
            ['Setup', 'Introduction', 'Basics'],
            ['Fundamentals', 'Core Concepts', 'Syntax'],
            ['Intermediate', 'Applications', 'Practice'],
            ['Advanced', 'Complex Topics', 'Integration']
        ];
        return baseTopics[Math.min(week - 1, 3)] || ['Advanced Topics', 'Specialization', 'Expert Level'];
    }
    
    generateWeekResources(learningStyle) {
        const resourceMap = {
            'Visual': ['Infographics', 'Video Tutorials', 'Diagrams'],
            'Hands-on Projects': ['Project Templates', 'Code Repositories', 'Interactive Exercises'],
            'Reading': ['Documentation', 'Articles', 'Books'],
            'Video Tutorials': ['Video Course', 'YouTube Playlist', 'Online Lectures']
        };
        return resourceMap[learningStyle] || ['Mixed Resources', 'Tutorials', 'Practice'];
    }
    
    generateWeekProject(week, subject) {
        const projects = [
            `Setup your ${subject} development environment`,
            `Build a simple ${subject} application`,
            `Create an interactive ${subject} project`,
            `Develop a complex ${subject} system`
        ];
        return projects[Math.min(week - 1, 3)] || `Advanced ${subject} project implementation`;
    }
    
    calculateWeeklyHours(timeCommitment) {
        const hoursMap = {
            '2-5 hours/week': 4,
            '5-10 hours/week': 8,
            '10-15 hours/week': 12,
            '15+ hours/week': 20
        };
        return hoursMap[timeCommitment] || 8;
    }
    
    // Dashboard methods
    showDashboard() {
        this.hideAllSections();
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.remove('hidden');
            this.updateDashboard();
        }
    }
    
    updateDashboard() {
        if (!this.currentUser) return;
        
        // Update user info
        const userAvatar = document.getElementById('userAvatar');
        const welcomeUser = document.getElementById('welcomeUser');
        const userLevel = document.getElementById('userLevel');
        const userXP = document.getElementById('userXP');
        
        if (userAvatar) userAvatar.textContent = this.getAvatarEmoji(this.currentUser.avatar);
        if (welcomeUser) welcomeUser.textContent = `Welcome back, ${this.currentUser.name}!`;
        if (userLevel) userLevel.textContent = this.currentUser.level;
        if (userXP) userXP.textContent = this.currentUser.xp;
        
        // Update stats
        const streakCount = document.getElementById('streakCount');
        const badgeCount = document.getElementById('badgeCount');
        const weeksCompleted = document.getElementById('weeksCompleted');
        const completionRate = document.getElementById('completionRate');
        
        if (streakCount) streakCount.textContent = this.currentUser.streak || 0;
        if (badgeCount) badgeCount.textContent = this.currentUser.badges?.length || 0;
        if (weeksCompleted) weeksCompleted.textContent = this.currentUser.completedWeeks || 0;
        
        // Calculate and update completion rate
        const totalWeeks = this.currentUser.learningPath?.weeks?.length || 0;
        const completedWeeks = this.currentUser.completedWeeks || 0;
        const completionPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;
        if (completionRate) completionRate.textContent = `${completionPercentage}%`;
        
        // Update current learning path
        this.updateCurrentPath();
        
        // Update recent badges
        this.updateRecentBadges();
    }
    
    updateCurrentPath() {
        if (this.currentUser.learningPath) {
            const path = this.currentUser.learningPath;
            const pathTitle = document.getElementById('pathTitle');
            const pathDuration = document.getElementById('pathDuration');
            
            if (pathTitle) pathTitle.textContent = path.title;
            if (pathDuration) pathDuration.textContent = path.duration;
            
            // Update progress
            const totalWeeks = path.weeks.length;
            const completedWeeks = this.currentUser.completedWeeks || 0;
            const progress = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;
            
            const pathProgress = document.getElementById('pathProgress');
            const pathProgressText = document.getElementById('pathProgressText');
            
            if (pathProgress) pathProgress.style.width = `${progress}%`;
            if (pathProgressText) pathProgressText.textContent = `${Math.round(progress)}% Complete`;
            
            // Update current week info
            const currentWeekElement = document.getElementById('currentWeek');
            if (currentWeekElement) {
                if (completedWeeks < totalWeeks) {
                    const currentWeek = path.weeks[completedWeeks];
                    currentWeekElement.innerHTML = `
                        <h5>Week ${currentWeek.week}: ${currentWeek.title}</h5>
                        <p>${currentWeek.topics.join(' • ')}</p>
                    `;
                } else {
                    currentWeekElement.innerHTML = `
                        <h5>🎉 Congratulations!</h5>
                        <p>You've completed your entire learning path!</p>
                    `;
                }
            }
        } else {
            const pathTitle = document.getElementById('pathTitle');
            const pathDuration = document.getElementById('pathDuration');
            const currentWeek = document.getElementById('currentWeek');
            
            if (pathTitle) pathTitle.textContent = 'No active path';
            if (pathDuration) pathDuration.textContent = '';
            if (currentWeek) {
                currentWeek.innerHTML = `
                    <h5>Getting Started</h5>
                    <p>Complete your profile to begin your learning journey!</p>
                `;
            }
        }
    }
    
    updateRecentBadges() {
        const badgesContainer = document.getElementById('recentBadges');
        if (!badgesContainer) return;
        
        const userBadges = this.currentUser.badges || [];
        
        if (userBadges.length === 0) {
            badgesContainer.innerHTML = `
                <div class="empty-state">
                    <p>Complete activities to earn badges!</p>
                </div>
            `;
            return;
        }
        
        badgesContainer.innerHTML = userBadges.slice(-4).map(badgeId => {
            const badge = this.badges.find(b => b.id === badgeId);
            return `
                <div class="badge-item earned">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-description">${badge.description}</div>
                </div>
            `;
        }).join('');
    }
    
    // Path view methods
    showPathView() {
        if (!this.currentUser.learningPath) {
            this.showToast('No learning path available. Complete onboarding first!', 'info');
            return;
        }
        
        this.hideAllSections();
        const pathView = document.getElementById('pathView');
        if (pathView) {
            pathView.classList.remove('hidden');
            this.updatePathView();
        }
    }
    
    updatePathView() {
        const path = this.currentUser.learningPath;
        if (!path) return;
        
        // Update header info
        const pathViewTitle = document.getElementById('pathViewTitle');
        const pathViewDuration = document.getElementById('pathViewDuration');
        const pathViewDifficulty = document.getElementById('pathViewDifficulty');
        
        if (pathViewTitle) pathViewTitle.textContent = path.title;
        if (pathViewDuration) pathViewDuration.textContent = path.duration;
        if (pathViewDifficulty) pathViewDifficulty.textContent = path.difficulty;
        
        // Update overall progress
        const totalWeeks = path.weeks.length;
        const completedWeeks = this.currentUser.completedWeeks || 0;
        const progress = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;
        
        const overallPercentage = document.getElementById('overallPercentage');
        if (overallPercentage) overallPercentage.textContent = `${Math.round(progress)}%`;
        
        // Update progress circle
        const progressCircle = document.getElementById('overallProgress');
        if (progressCircle) {
            progressCircle.style.background = `conic-gradient(var(--neon-cyan) ${progress * 3.6}deg, var(--dark-border) 0deg)`;
        }
        
        // Update week summary
        this.updateWeekSummary();
        
        // Update weeks timeline
        this.updateWeeksTimeline();
    }
    
    updateWeekSummary() {
        const path = this.currentUser.learningPath;
        const completedWeeks = this.currentUser.completedWeeks || 0;
        const summaryElement = document.getElementById('weekSummary');
        
        if (!summaryElement || !path) return;
        
        if (completedWeeks < path.weeks.length) {
            const currentWeek = path.weeks[completedWeeks];
            summaryElement.innerHTML = `
                <div class="summary-content">
                    <h4>Week ${currentWeek.week}: ${currentWeek.title}</h4>
                    <p><strong>Focus Areas:</strong> ${currentWeek.topics.join(', ')}</p>
                    <p><strong>This Week's Project:</strong> ${currentWeek.project}</p>
                    <p><strong>Estimated Time:</strong> ${currentWeek.hours} hours</p>
                </div>
            `;
        } else {
            summaryElement.innerHTML = `
                <div class="summary-content">
                    <h4>🎉 Path Completed!</h4>
                    <p>Congratulations on completing your learning journey! Consider starting a new path or exploring advanced topics.</p>
                </div>
            `;
        }
    }
    
    updateWeeksTimeline() {
        const path = this.currentUser.learningPath;
        const completedWeeks = this.currentUser.completedWeeks || 0;
        const timelineElement = document.getElementById('weeksTimeline');
        
        if (!timelineElement || !path) return;
        
        timelineElement.innerHTML = path.weeks.map((week, index) => {
            const isCompleted = index < completedWeeks;
            const isCurrent = index === completedWeeks;
            const statusClass = isCompleted ? 'completed' : (isCurrent ? 'current' : '');
            
            return `
                <div class="week-item ${statusClass}" data-week="${week.week}">
                    <div class="week-header">
                        <div class="week-number">${week.week}</div>
                        <div class="week-title">
                            <h4>${week.title}</h4>
                            <div class="week-duration">${week.hours} hours • Week ${week.week}</div>
                        </div>
                        <div class="week-status">
                            ${isCompleted ? '✅ Completed' : (isCurrent ? '📚 Current' : '⏳ Upcoming')}
                        </div>
                    </div>
                    
                    <div class="week-topics">
                        ${week.topics.map(topic => `<div class="topic-item">${topic}</div>`).join('')}
                    </div>
                    
                    <div class="week-project">
                        <h5>🎯 Week Project</h5>
                        <p>${week.project}</p>
                    </div>
                    
                    <div class="week-resources">
                        <h5>📚 Recommended Resources</h5>
                        <ul>
                            ${week.resources.map(resource => `<li>${resource}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${isCurrent ? `
                        <button class="btn btn--primary complete-week-btn" onclick="app.completeWeek(${week.week})">
                            Mark Week as Complete
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
    
    completeWeek(weekNumber) {
        this.currentUser.completedWeeks = weekNumber;
        this.currentUser.xp += 100;
        
        // Check for level up
        this.checkLevelUp();
        
        // Award badges
        if (weekNumber === 1) {
            this.awardBadge('week_complete');
        }
        
        // Check for streak
        this.updateStreak();
        
        // Check if path is completed
        if (weekNumber === this.currentUser.learningPath.weeks.length) {
            this.awardBadge('completionist');
            this.showToast('🎉 Congratulations! You\'ve completed your entire learning path!', 'success');
        } else {
            this.showToast(`Week ${weekNumber} completed! +100 XP`, 'success');
        }
        
        this.saveUserData();
        this.updatePathView();
    }
    
    // Gamification methods
    awardBadge(badgeId) {
        if (!this.currentUser.badges.includes(badgeId)) {
            this.currentUser.badges.push(badgeId);
            const badge = this.badges.find(b => b.id === badgeId);
            this.showToast(`Badge earned: ${badge.name} ${badge.icon}`, 'success');
        }
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.currentUser.xp / 500) + 1;
        if (newLevel > this.currentUser.level) {
            this.currentUser.level = newLevel;
            this.showToast(`🎉 Level Up! You're now level ${newLevel}!`, 'success');
        }
    }
    
    updateStreak() {
        const lastActivity = this.currentUser.lastActivity || Date.now();
        const daysSinceLastActivity = Math.floor((Date.now() - lastActivity) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastActivity <= 1) {
            this.currentUser.streak = (this.currentUser.streak || 0) + 1;
        } else {
            this.currentUser.streak = 1;
        }
        
        this.currentUser.lastActivity = Date.now();
        
        // Award streak badges
        if (this.currentUser.streak === 7) {
            this.awardBadge('streak_7');
        } else if (this.currentUser.streak === 30) {
            this.awardBadge('streak_30');
        }
    }
    
    // Utility methods
    getAvatarEmoji(avatarId) {
        const avatar = this.avatars.find(a => a.id === avatarId);
        return avatar ? avatar.image : '🤖';
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Navigation methods
    hideLanding() {
        const landing = document.getElementById('landing');
        if (landing) landing.classList.add('hidden');
    }
    
    showLanding() {
        this.hideAllSections();
        const landing = document.getElementById('landing');
        if (landing) landing.classList.remove('hidden');
    }
    
    showOnboarding() {
        this.hideAllSections();
        const onboarding = document.getElementById('onboarding');
        if (onboarding) onboarding.classList.remove('hidden');
    }
    
    hideOnboarding() {
        const onboarding = document.getElementById('onboarding');
        if (onboarding) onboarding.classList.add('hidden');
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.classList.remove('hidden');
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }
    
    hideAllSections() {
        const sections = ['landing', 'onboarding', 'dashboard', 'pathView', 'loadingScreen'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }
    
    // Data persistence
    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Update users array
            const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = savedUsers.findIndex(u => u.id === this.currentUser.id);
            if (userIndex > -1) {
                savedUsers[userIndex] = this.currentUser;
                localStorage.setItem('users', JSON.stringify(savedUsers));
            }
        }
    }
    
    loadUserData() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            localStorage.removeItem('currentUser');
        }
    }
    
    checkAuthStatus() {
        if (this.currentUser) {
            if (this.currentUser.hasCompletedOnboarding) {
                this.showDashboard();
            } else {
                this.startOnboarding();
            }
        } else {
            this.showLanding();
        }
    }
    
    showProfile() {
        this.showToast('Profile management coming soon!', 'info');
    }
}

// Initialize the application
const app = new AILearningApp();

// Make app globally available for event handlers
window.app = app;