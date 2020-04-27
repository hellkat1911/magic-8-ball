const Module = (function() {

  function EightBall({ img, answer, question, table, submitBtn, deleteBtn }) {
    this.img = document.getElementById(img);
    this.answer = document.getElementById(answer);
    this.input = document.getElementById(question);
    this.table = document.getElementById(table);
    this.submitBtn = document.getElementById(submitBtn);
    this.deleteBtn = document.getElementById(deleteBtn);
  
    // array of strings ('type')
    this.resultHistory = [];

    this.shakeBall = () => {
      this.img.classList.remove('shake');
      void this.img.offsetWidth; // trigger reflow
      this.img.classList.add('shake');
    };
  
    EightBall.prototype.getHistory = async () => {
      const call = await fetch('/api/history');
      const response = await call.json();

      if (response.status !== 200) {
        throw new Error('Could not fetch history data');
      }
  
      if (!response.data || response.data.length < 1) {
        this.resultHistory = [];
        return;
      }
  
      this.resultHistory = response.data;
      this.updateTable(null, false);
    };
  
    EightBall.prototype.saveHistory = async () => {
      // only save most recent 10 entries,
      // since that is all we display
      let history = this.resultHistory.length > 10
        ? this.resultHistory.slice(-10)
        : this.resultHistory;
  
      const call = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: history })
      });
      const response = await call.json();
  
      if (response.status !== 200) {
        throw new Error('Could not save history data');
      }
    };
  
    EightBall.prototype.deleteHistory = async () => {
      const call = await fetch('/api/history', {
        method: 'DELETE'
      });
      const response = await call.json();
  
      if (response.status !== 200) {
        throw new Error('Could not delete history data');
      } else {
        this.resultHistory = response.data;
        this.updateTable(null, false);
      }
    };
  
    EightBall.prototype.updateAnswer = (text, error = false) => {
      error
        ? this.answer.classList.add('error')
        : this.answer.classList.remove('error');
  
      this.answer.textContent = text;
    };
  
    EightBall.prototype.updateTable = (type, resave = true) => {
      const rows = {
        contrary: '<div class="row contrary">Contrary</div>',
        neutral: '<div class="row neutral">Neutral</div>',
        affirmative: '<div class="row affirmative">Affirmative</div>'
      };
  
      let html = '<div class="header">History of Luck</div>';
  
      if (typeof type === 'string' && type !== '') {
        this.resultHistory.push(type.toLowerCase());
      }
  
      // show placeholder if there is zero history
      if (this.resultHistory.length < 1) {
        html += '<div class="row">Results will be shown here!</div>';
      }
      
      // limit history to most recent 10 results
      let toShow = this.resultHistory.length > 10
        ? this.resultHistory.slice(-10)
        : this.resultHistory;
  
      toShow.forEach(result => {
        html += rows[result];
      });
  
      this.table.innerHTML = html;
      if (resave) this.saveHistory();
    };
  
    EightBall.prototype.handleQuestion = async (event) => {
      event.preventDefault();

      const raw = this.input.value;
    
      if (!raw) {
        // catch blank question
        let text = 'Please ask a question to receive an answer!';
        this.updateAnswer(text, true);
        return;
      }
    
      const params = encodeURIComponent(raw);
      const uri = 'https://8ball.delegator.com/magic/JSON/' + params;

      const makeCall = async () => {
        try {
          const call = await fetch(uri);
          const { magic: response } = await call.json();
    
          this.updateAnswer(response.answer);
          this.updateTable(response.type);
          this.input.value = '';
    
        } catch (err) {
          let text = 'Error: could not retrieve answer...';
          this.updateAnswer(text, true);
        }
        this.img.removeEventListener('animationend', makeCall); 
      };
      
      // fetch answer as soon as animation ends
      this.img.addEventListener('animationend', makeCall, false);
      this.shakeBall();
    };

    EightBall.prototype.init = () => {
      // set up event listeners
      this.submitBtn.addEventListener('click', this.handleQuestion, false);
      this.deleteBtn.addEventListener('click', this.deleteHistory, false);

      // fetch history on first load
      this.getHistory();
    };
  }

  return {
    EightBall
  };
})();