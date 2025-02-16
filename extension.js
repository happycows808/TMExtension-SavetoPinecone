(async () => { // Wrap in an async function

    // Function to add the save button (modified)
    function addSaveButton() {
        // Find the Voice Input button
        const voiceInputButton = document.querySelector('button[data-element-id="voice-input-button"]');

        if (voiceInputButton && voiceInputButton.parentElement) {
            // Create the Save button (same as before)
            const saveButton = document.createElement('button');
            saveButton.setAttribute('data-element-id', 'save-to-pinecone-button');
            saveButton.className = voiceInputButton.className; // Copy the classes
            saveButton.style.cursor = 'pointer';
            saveButton.setAttribute('data-tooltip-content', 'Save chat to Pinecone');
            saveButton.setAttribute('data-tooltip-id', 'global');

            // Create the icon span (using a save icon)
            const iconSpan = document.createElement('span');
            const iconSpanInVoice = voiceInputButton.querySelector('svg');
            if (iconSpanInVoice) {
                iconSpan.className = iconSpanInVoice.className;
            } else {
                iconSpan.className = 'block w-[35px] h-[35px] flex items-center justify-center';
            }
            iconSpan.innerHTML = `
                <svg class="w-5 h-5" width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7h-8v7H7v-7H5l7-7 7 7zM5 17v2h14v-2H5z" fill="currentColor"/>
                </svg>
              `;

            // Assemble the button
            saveButton.appendChild(iconSpan);

            // Attach the click event (for now, a test function)
            saveButton.onclick = () => {
                // **TEST FUNCTION - Replace with your data retrieval logic**
                alert("Save to Pinecone button clicked!  (Replace this with your data retrieval and Pinecone embedding logic)");
            };

            // Insert the button after the Voice Input button
            voiceInputButton.parentElement.insertBefore(saveButton, voiceInputButton.nextSibling);
        }
    }


    // Create a MutationObserver
    const observer = new MutationObserver((mutations) => {
        // Check if the save button exists. If not, re-add it.
        if (!document.querySelector('button[data-element-id="save-to-pinecone-button"]')) {
            addSaveButton();
        }
    });

    // Find a parent element that is *likely* to be stable (not re-rendered often)
    //  We'll observe this parent for changes.  The closer to the root, the more
    //  changes we'll observe (potentially impacting performance), but the less
    //  likely our target element will be completely removed.  A good balance is
    //  often a parent element a few levels up.
    const targetNode = document.querySelector('div.items-center.justify-start.gap-1.flex'); // The div containing the buttons

    if (targetNode) {
        // Start observing the target node for changes
        observer.observe(targetNode, {
            childList: true, // Watch for changes to the list of children
            subtree: true    // Watch for changes in all descendants
        });

        // Add the button initially (it might not be there yet when the observer starts)
        addSaveButton();

    } else {
        console.error("Target node for MutationObserver not found.");
    }

})(); // Immediately invoke the async function

