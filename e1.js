(async () => {

    // Function to add the save button
    function addSaveButton() {
        const voiceInputButton = document.querySelector('button[data-element-id="voice-input-button"]');

        if (voiceInputButton && voiceInputButton.parentElement) {
            // Check if the button already exists
            if (!document.querySelector('button[data-element-id="save-to-pinecone-button"]')) {
                const saveButton = document.createElement('button');
                saveButton.setAttribute('data-element-id', 'save-to-pinecone-button');
                saveButton.className = voiceInputButton.className;
                saveButton.style.cursor = 'pointer';
                saveButton.setAttribute('data-tooltip-content', 'Save chat to Pinecone');
                saveButton.setAttribute('data-tooltip-id', 'global');

                const iconSpan = document.createElement('span');
                // More efficient way to get the class name
                iconSpan.className = voiceInputButton.querySelector('svg')?.className || 'block w-[35px] h-[35px] flex items-center justify-center';

                iconSpan.innerHTML = `
                    <svg class="w-5 h-5" width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7h-8v7H7v-7H5l7-7 7 7zM5 17v2h14v-2H5z" fill="currentColor"/>
                    </svg>
                  `;

                saveButton.appendChild(iconSpan);

                saveButton.onclick = () => {
                    alert("Save to Pinecone button clicked! (Replace this with your data retrieval and Pinecone embedding logic)");
                };

                voiceInputButton.parentElement.insertBefore(saveButton, voiceInputButton.nextSibling);
            }
        }
    }


    // Function to set up the MutationObserver
    function setupObserver() {
        const targetNode = document.querySelector('div.items-center.justify-start.gap-1.flex');

        if (targetNode) {
            const observer = new MutationObserver((mutations) => {
                // More concise check for button existence
                if (!document.querySelector('button[data-element-id="save-to-pinecone-button"]')) {
                    addSaveButton();
                }
            });

            observer.observe(targetNode, { childList: true, subtree: true });
            return observer; // Return the observer
        } else {
            console.error("Target node for MutationObserver not found.");
            return null; // Explicitly return null
        }
    }

    // Function to handle hash changes
    function handleHashChange() {
        // Disconnect any existing observer
        if (window.currentObserver) {
            window.currentObserver.disconnect();
            window.currentObserver = null; // Clear the reference
        }

        addSaveButton(); // Add the button

        // Set up a new observer
        window.currentObserver = setupObserver();
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Initial setup
    handleHashChange();

})();
