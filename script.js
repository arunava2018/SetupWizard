document.addEventListener("DOMContentLoaded", () => {
  const osText = document.getElementById("os-detect");
  const radios = document.querySelectorAll('input[name="os"]');
  const nextBtn = document.getElementById("next-btn");
  const previousBtn = document.getElementById("previous-btn");
  const generateBtn = document.getElementById("generate-btn");
  const scriptBox = document.querySelector(".script-box");
  const hamburger = document.querySelector(".hamburger");
  const headerLinks = document.querySelector(".header-links");

  // Toggle menu for mobile
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      headerLinks.classList.toggle("active");
    });
  }

  // Installation commands for different OS
  const installationCommands = {
    Windows: {
      "Node.js": "winget install OpenJS.NodeJS",
      Git: "winget install Git.Git",
      "GitHub CLI": "winget install GitHub.GitHubCLI",
      Docker: "winget install Docker.DockerDesktop",
      Python: "winget install Python.Python",
      "Visual Studio Code": "winget install Microsoft.VisualStudioCode",
      Rust: "winget install Rust.Rust",
      Go: "winget install GoLang.Go",
      Postman: "winget install Postman.Postman",
      "VLC Media Player": "winget install VideoLAN.VLC",
      Slack: "winget install SlackTechnologies.Slack",
      "Notepad++": "winget install Notepad++.Notepad++",
      MongoDB: "winget install MongoDB.MongoDBCompass",
      "IntelliJ IDEA": "winget install JetBrains.IntelliJIDEA",
    },
    Macos: {
      "Node.js": "brew install node",
      Git: "brew install git",
      "GitHub CLI": "brew install gh",
      Docker: "brew install --cask docker",
      Python: "brew install python",
      "Visual Studio Code": "brew install --cask visual-studio-code",
      Rust: "brew install rust",
      Go: "brew install go",
      Postman: "brew install --cask postman",
      "VLC Media Player": "brew install --cask vlc",
      Slack: "brew install --cask slack",
      "Notepad++": "brew install --cask notepad-plus-plus",
      MongoDB: "brew install --cask mongodb-compass",
      "IntelliJ IDEA": "brew install --cask intellij-idea",
    },
    Linux: {
      "Node.js": "sudo apt install nodejs",
      Git: "sudo apt install git",
      "GitHub CLI": "sudo apt install gh",
      Docker: "sudo apt install docker.io",
      Python: "sudo apt install python3",
      "Visual Studio Code": "sudo apt install code",
      Rust: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      Go: "sudo apt install golang",
      Postman: "sudo apt install postman",
      "VLC Media Player": "sudo apt install vlc",
      Slack: "sudo apt install slack-desktop",
      "Notepad++": "sudo apt install notepad-plus-plus",
      MongoDB: "sudo apt install mongodb",
      "IntelliJ IDEA": "sudo snap install intellij-idea-community --classic",
    },
  };

  // Detect OS and set initial state
  let detectedOS = "Windows";
  if (navigator.userAgent.indexOf("Win") !== -1) detectedOS = "Windows";
  if (navigator.userAgent.indexOf("Mac") !== -1) detectedOS = "Macos";
  if (navigator.userAgent.indexOf("Linux") !== -1) detectedOS = "Linux";

  // Get selected OS from localStorage or use detected OS
  let selectedOS = localStorage.getItem("selectedOS") || detectedOS;

  // Update OS text if on index page
  if (osText) {
    osText.innerHTML = `Detected OS: ${detectedOS}`;
  }

  // Set initial radio button state and add click handlers
  radios.forEach((radio) => {
    if (radio.value === selectedOS) {
      radio.checked = true;
    }
    radio.addEventListener("change", (event) => {
      selectedOS = event.target.value;
      if (osText) {
        osText.innerHTML = `Selected OS: ${selectedOS}`;
      }
      localStorage.setItem("selectedOS", selectedOS);
    });
  });

  // Enable Next button and add click handler
  if (nextBtn) {
    nextBtn.style.pointerEvents = "auto";
    nextBtn.style.opacity = "1";
    nextBtn.addEventListener("click", () => {
      window.location.href = "tools.html";
    });
  }

  // Handle Previous button
  if (previousBtn) {
    previousBtn.addEventListener("click", () => {
      window.history.back();
    });
  }

  // Handle Generate Script button
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const selectedTools = document.querySelectorAll(".tools-item input:checked");
      const generatedScripts = {};

      selectedTools.forEach((tool) => {
        const toolName = tool.nextElementSibling.textContent.trim();
        if (installationCommands[selectedOS][toolName]) {
          generatedScripts[toolName] = installationCommands[selectedOS][toolName];
        }
      });

      localStorage.setItem("generatedScripts", JSON.stringify(generatedScripts));
      window.location.href = "scripts.html";
    });
  }

  // Handle Scripts page
  if (window.location.href.includes("scripts.html")) {
    const copyAllBtn = document.getElementById("copy-all-btn");
    const scriptBox = document.querySelector(".script-box");
    const generatedScripts = JSON.parse(localStorage.getItem("generatedScripts"));

    if (generatedScripts && Object.keys(generatedScripts).length > 0) {
      scriptBox.innerHTML = "";
      let allScripts = "";

      Object.entries(generatedScripts).forEach(([tool, script]) => {
        const scriptItem = document.createElement("div");
        scriptItem.classList.add("script-item");
        scriptItem.innerHTML = `
          <strong>${tool}:</strong> <code>${script}</code>
          <br>
        `;
        scriptBox.appendChild(scriptItem);
        allScripts += `${tool}: ${script}\n`;
      });

      if (copyAllBtn) {
        copyAllBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(allScripts).then(() => {
            copyAllBtn.innerHTML = '<i class="fa fa-check"></i> Copied!';
            setTimeout(() => {
              copyAllBtn.innerHTML = '<i class="fa fa-copy"></i> Copy All';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        });
      }
    } else {
      scriptBox.innerHTML = "<p>No installation scripts found. Please go back and select tools to install.</p>";
    }
  }
});