document.addEventListener("DOMContentLoaded", () => {
  const osText = document.getElementById("os-detect");
  const radios = document.querySelectorAll('input[name="os"]');
  const nextBtn = document.getElementById("next-btn");
  const previousBtn = document.getElementById("previous-btn");
  const generateBtn = document.getElementById("generate-btn");
  const scriptBox = document.querySelector(".script-box");

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

  let detectedOS = "Windows";
  let selectedOS = localStorage.getItem("selectedOS") || "Windows";

  // Detect the OS based on user agent
  if (navigator.userAgent.indexOf("Win") !== -1) detectedOS = "Windows";
  if (navigator.userAgent.indexOf("Mac") !== -1) detectedOS = "Macos";
  if (navigator.userAgent.indexOf("Linux") !== -1) detectedOS = "Linux";

  if (window.location.href.includes("index.html")) {
    osText.innerHTML = `Detected OS: ${detectedOS}`;
  }

  // Update the OS selection when user selects a different OS
  radios.forEach((radio) => {
    if (radio.value === detectedOS) {
      radio.checked = true;
    }
    radio.addEventListener("click", (event) => {
      selectedOS = `${event.target.value}`;
      osText.innerHTML = `Selected OS: ${event.target.value}`;
      localStorage.setItem("selectedOS", selectedOS);
    });
  });

  // Event Listener for Next button on index.html
  if (window.location.href.includes("index.html")) {
    nextBtn.addEventListener("click", () => {
      window.location.href = "tools.html";
    });
  }

  // Event Listener for Previous button on both index and tools pages
  if (previousBtn) {
    previousBtn.addEventListener("click", () => {
      if (window.location.href.includes("tools.html"))
        window.location.href = "index.html";
    });
  }

  // Event Listener for Generate Script button on tools.html
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const selectedTools = document.querySelectorAll(
        ".tools-item input:checked"
      );
      const generatedScripts = {};

      selectedTools.forEach((tool) => {
        const toolName = tool.nextElementSibling.textContent.trim();
        if (installationCommands[selectedOS][toolName]) {
          generatedScripts[toolName] =
            installationCommands[selectedOS][toolName];
        }
      });

      // Save generated scripts in localStorage
      localStorage.setItem(
        "generatedScripts",
        JSON.stringify(generatedScripts)
      );

      // Redirect to scripts.html
      window.location.href = "scripts.html";
    });
  }

  // Scripts page - Retrieve and display scripts
  if (window.location.href.includes("scripts.html")) {
    const generatedScripts = JSON.parse(
      localStorage.getItem("generatedScripts")
    );

    // Check if scripts exist in localStorage
    const copyAllBtn = document.getElementById("copy-all-btn");
    const scriptBox = document.querySelector(".script-box");

    if (generatedScripts && Object.keys(generatedScripts).length > 0) {
      // Create a container for all scripts and append it to the script box
      let allScripts = "";
      for (const [tool, script] of Object.entries(generatedScripts)) {
        const container = document.createElement("div");
        container.classList.add("script-item");
        container.innerHTML = `
          <strong></strong> <code>${script}</code>
          <br>
        `;
        scriptBox.appendChild(container);

        // Accumulate the scripts to be copied
        allScripts += `${tool}: ${script}\n`;
      }

      // Copy all scripts when the "Copy All" button is clicked
      if (copyAllBtn) {
        copyAllBtn.addEventListener("click", () => {
          // Create a temporary textarea to copy all scripts
          const tempTextArea = document.createElement("textarea");
          tempTextArea.value = allScripts; // Add all the scripts to the textarea
          document.body.appendChild(tempTextArea);
          tempTextArea.select();
          document.execCommand("copy");
          document.body.removeChild(tempTextArea);

          // Provide feedback (you can change the button icon to a checkmark, for example)
          copyAllBtn.innerHTML = '<i class="fa fa-check"></i> All Copied!';

          // Reset button text after a short delay
          setTimeout(() => {
            copyAllBtn.innerHTML = '<i class="fa fa-copy"></i> Copy All';
          }, 2000);
        });
      }
    } else {
      scriptBox.innerHTML =
        "<p>No installation scripts found. Please go back and select tools to install.</p>";
    }

    const previousBtn = document.getElementById("script-previous-btn");
    if (previousBtn) {
      previousBtn.addEventListener("click", () => {
        window.location.href = "tools.html";
      });
    }
  }
});
