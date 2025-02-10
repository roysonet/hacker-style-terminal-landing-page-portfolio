const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const terminal = document.getElementById('terminal');
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');
    const terminalHeader = document.getElementById('terminalHeader');
    const terminalResizeHandle = document.getElementById('terminalResizeHandle');
    const closeTerminalButton = document.getElementById('closeTerminalButton');
    const nameElement = document.getElementById('name');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let chars = '01';
    chars = chars.split('');

    let fontSize = 16;
    let columns = canvas.width / fontSize;
    let drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        let text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function startAnimation() {
      document.querySelector('.content').style.display = 'none';
      terminal.style.display = 'flex';
      terminalInput.focus();
      setInterval(draw, 33);
      makeTerminalDraggable(terminal, terminalHeader);
      makeTerminalResizable(terminal, terminalResizeHandle);
      displayInstructions();
    }

    startButton.addEventListener('click', startAnimation);

    function displayInstructions() {
      addTerminalLine("Type 'help' for available commands.");
    }

    function addTerminalLine(text) {
      const line = document.createElement('p');
      line.classList.add('terminal-line');
      line.innerHTML = `<span class="terminal-prompt">user@portfolio:~$</span> <span class="terminal-command">${text}</span>`;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    terminalInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const command = terminalInput.textContent.trim();
        terminalInput.textContent = '';
        processCommand(command);
      }
    });

    function processCommand(command) {
      addTerminalLine(command);

      switch (command.toLowerCase()) {
        case 'help':
          openNewTerminal("Help", "Available commands: help, about, projects, contact, clear");
          break;
        case 'about':
          openNewTerminal("About", "I'm a passionate software developer...");
          break;
        case 'projects':
          openNewTerminal("Projects", "My projects include...");
          break;
        case 'contact':
          openNewTerminal("Contact", "You can reach me at...");
          break;
        case 'clear':
          terminalBody.innerHTML = '';
          break;
        default:
          addTerminalLine(`<span style="color: red;">Invalid command. Type 'help' for assistance.</span>`);
      }
      addTerminalLine(""); // Add a blank line after the command output
    }

    function openNewTerminal(title, content) {
      addTerminalLine(`<span style="color: yellow;">Opening ${title} terminal...</span>`);
      const newTerminal = document.createElement('div');
      newTerminal.classList.add('new-terminal');
      newTerminal.innerHTML = `
        <div class="new-terminal-header">
          ${title}
          <div class="new-terminal-buttons">
            <span class="new-terminal-button close" style="background-color: #f00;"></span>
          </div>
        </div>
        <div class="new-terminal-body">
          <p>${content}</p>
        </div>
        <div class="new-terminal-resize-handle"></div>
      `;
      document.body.appendChild(newTerminal);
      newTerminal.style.display = 'block';

      const newTerminalHeader = newTerminal.querySelector('.new-terminal-header');
      const newTerminalResizeHandle = newTerminal.querySelector('.new-terminal-resize-handle');
      const newTerminalCloseButton = newTerminal.querySelector('.new-terminal-button.close');

      makeTerminalDraggable(newTerminal, newTerminalHeader);
      makeTerminalResizable(newTerminal, newTerminalResizeHandle);

      newTerminalCloseButton.addEventListener('click', () => {
        newTerminal.remove();
        addTerminalLine(`<span style="color: yellow;">${title} terminal closed.</span>`);
      });
    }

    function makeTerminalDraggable(terminalElement, headerElement) {
      let isDragging = false;
      let offsetX, offsetY;

      headerElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - terminalElement.offsetLeft;
        offsetY = e.clientY - terminalElement.offsetTop;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        terminalElement.style.left = e.clientX - offsetX + 'px';
        terminalElement.style.top = e.clientY - offsetY + 'px';
      });
    }

    function makeTerminalResizable(terminalElement, resizeHandleElement) {
      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      resizeHandleElement.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = terminalElement.offsetWidth;
        startHeight = terminalElement.offsetHeight;
      });

      document.addEventListener('mouseup', () => {
        isResizing = false;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);

        terminalElement.style.width = `${Math.max(width, 200)}px`;
        terminalElement.style.height = `${Math.max(height, 150)}px`;
      });
    }

    closeTerminalButton.addEventListener('click', () => {
      window.location.reload();
    });

    // Set the text content for the typing effect
    const text = "</sonet.dev>";
    let index = 0;

    function type() {
      if (index < text.length) {
        nameElement.textContent += text.charAt(index);
        index++;
      }
    }

    // Start the typing effect when the DOM is fully loaded
    document.addEventListener("DOMContentLoaded", () => {
      type();
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = canvas.width / fontSize;
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
    });
