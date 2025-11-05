// Football Match Simulator
class FootballMatch {
    constructor() {
        this.homeTeam = 'Manchester United';
        this.awayTeam = 'Liverpool';
        this.homeScore = 0;
        this.awayScore = 0;
        this.matchTime = 0;
        this.isRunning = false;
        this.matchInterval = null;
        this.events = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        // Score elements
        this.homeScoreEl = document.getElementById('home-score');
        this.awayScoreEl = document.getElementById('away-score');
        this.homeTeamNameEl = document.getElementById('home-team-name');
        this.awayTeamNameEl = document.getElementById('away-team-name');
        
        // Match time elements
        this.matchTimeEl = document.getElementById('match-time');
        this.matchStatusEl = document.getElementById('match-status');
        
        // Button elements
        this.startBtn = document.getElementById('start-match');
        this.pauseBtn = document.getElementById('pause-match');
        this.resetBtn = document.getElementById('reset-match');
        this.setTeamsBtn = document.getElementById('set-teams');
        
        // Team selection elements
        this.homeTeamInput = document.getElementById('home-team-input');
        this.awayTeamInput = document.getElementById('away-team-input');
        
        // Events list
        this.eventsListEl = document.getElementById('events-list');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startMatch());
        this.pauseBtn.addEventListener('click', () => this.pauseMatch());
        this.resetBtn.addEventListener('click', () => this.resetMatch());
        this.setTeamsBtn.addEventListener('click', () => this.setTeams());
    }

    setTeams() {
        if (this.isRunning) {
            alert('Cannot change teams during a match!');
            return;
        }
        
        this.homeTeam = this.homeTeamInput.value;
        this.awayTeam = this.awayTeamInput.value;
        
        if (this.homeTeam === this.awayTeam) {
            alert('Home and Away teams must be different!');
            return;
        }
        
        this.homeTeamNameEl.textContent = this.homeTeam;
        this.awayTeamNameEl.textContent = this.awayTeam;
        this.addEvent(0, `Teams set: ${this.homeTeam} vs ${this.awayTeam}`);
    }

    startMatch() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.matchStatusEl.textContent = 'Match in Progress';
        
        if (this.matchTime === 0) {
            this.addEvent(0, '⚽ Match Started!');
        } else {
            this.addEvent(this.matchTime, '▶️ Match Resumed');
        }
        
        this.matchInterval = setInterval(() => {
            this.matchTime++;
            this.updateDisplay();
            
            // Simulate random events
            this.simulateEvents();
            
            // End match at 90 minutes
            if (this.matchTime >= 90) {
                this.endMatch();
            }
        }, 1000); // 1 second = 1 minute in game time
    }

    pauseMatch() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.matchStatusEl.textContent = 'Match Paused';
        
        clearInterval(this.matchInterval);
        this.addEvent(this.matchTime, '⏸️ Match Paused');
    }

    resetMatch() {
        this.isRunning = false;
        this.matchTime = 0;
        this.homeScore = 0;
        this.awayScore = 0;
        this.events = [];
        
        clearInterval(this.matchInterval);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.matchStatusEl.textContent = 'Ready to Start';
        
        this.updateDisplay();
        this.clearEvents();
    }

    endMatch() {
        this.pauseMatch();
        this.matchStatusEl.textContent = 'Match Ended';
        this.startBtn.disabled = true;
        
        let result = '';
        if (this.homeScore > this.awayScore) {
            result = `${this.homeTeam} wins!`;
        } else if (this.awayScore > this.homeScore) {
            result = `${this.awayTeam} wins!`;
        } else {
            result = "It's a draw!";
        }
        
        this.addEvent(90, `🏁 Full Time: ${this.homeScore} - ${this.awayScore}. ${result}`);
    }

    simulateEvents() {
        // Random chance of goal (approximately 1 goal every 15 minutes on average)
        const goalChance = Math.random();
        
        if (goalChance < 0.02) { // 2% chance per minute
            const scoringTeam = Math.random() < 0.5 ? 'home' : 'away';
            this.scoreGoal(scoringTeam);
        }
        
        // Random chance of other events
        const eventChance = Math.random();
        
        if (eventChance < 0.03) { // 3% chance per minute
            this.randomEvent();
        }
    }

    scoreGoal(team) {
        if (team === 'home') {
            this.homeScore++;
            this.addEvent(this.matchTime, `⚽ GOAL! ${this.homeTeam} scores! ${this.homeScore} - ${this.awayScore}`, true);
        } else {
            this.awayScore++;
            this.addEvent(this.matchTime, `⚽ GOAL! ${this.awayTeam} scores! ${this.homeScore} - ${this.awayScore}`, true);
        }
        
        this.updateDisplay();
    }

    randomEvent() {
        const events = [
            '🟨 Yellow card shown',
            '🔄 Substitution made',
            '⚠️ Free kick awarded',
            '🚑 Player injured',
            '⚡ Great save by the goalkeeper!',
            '🎯 Shot on target!',
            '🔸 Corner kick',
            '📢 Offside call'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const team = Math.random() < 0.5 ? this.homeTeam : this.awayTeam;
        this.addEvent(this.matchTime, `${randomEvent} - ${team}`);
    }

    addEvent(time, description, isGoal = false) {
        this.events.unshift({ time, description, isGoal });
        this.updateEvents();
    }

    updateDisplay() {
        this.homeScoreEl.textContent = this.homeScore;
        this.awayScoreEl.textContent = this.awayScore;
        this.matchTimeEl.textContent = this.matchTime;
    }

    updateEvents() {
        this.eventsListEl.innerHTML = '';
        
        if (this.events.length === 0) {
            this.eventsListEl.innerHTML = '<p class="no-events">No events yet. Start the match!</p>';
            return;
        }
        
        this.events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = event.isGoal ? 'event-item event-goal' : 'event-item';
            eventDiv.innerHTML = `
                <span class="event-time">${event.time}'</span>
                <span class="event-description">${event.description}</span>
            `;
            this.eventsListEl.appendChild(eventDiv);
        });
    }

    clearEvents() {
        this.events = [];
        this.eventsListEl.innerHTML = '<p class="no-events">No events yet. Start the match!</p>';
    }
}

// Initialize the match when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FootballMatch();
});
