(async () => {
    const style = document.createElement('style');
    style.textContent = `
    :root {
      --text-color: #000; 
      --background-color: #fff; 
      --input-border-color: #ccc;
      --button-background-color: #007bff;
      --button-text-color: #fff;
      --button-hover-background-color: #0056b3;
      --description-color: #666;
      --saved-indicator-color: green;
    }

    
    @media (prefers-color-scheme: dark) {
      :root {
        --text-color: #fff; 
        --background-color: #333; 
        --input-border-color: #555;
        --button-background-color: #0056b3; 
        --description-color: #aaa;
      }
    }

    .pinecone-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      overflow: auto;
    }

    .pinecone-modal-content {
      background-color: var(--background-color);
      padding: 20px;
      border-radius: 8px;
      width: 80%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .pinecone-config-inputs {
      overflow-y: auto;
      max-height: 80vh;
    }

    .pinecone-input-wrapper {
        margin-bottom: 15px; 
    }

    .pinecone-input-label {
      display: block;
      margin-bottom: 5px;
      color: var(--text-color);
      font-weight: bold; 
    }

    .pinecone-input-field {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid var(--input-border-color);
      border-radius: 4px;
      box-sizing: border-box;
      color: var(--text-color);
      background-color: var(--background-color); 
    }
    
    .pinecone-input-field::placeholder {
        color: #999;
    }

    .pinecone-input-description {
      font-size: 0.8em;
      color: var(--description-color);
      margin-bottom: 10px;
    }

    .pinecone-saved-indicator {
      margin-left: 10px;
      color: var(--saved-indicator-color);
    }

    .pinecone-button {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      color: var(--button-text-color);
    }

    .pinecone-save-button {
      background-color: var(--button-background-color);
    }

    .pinecone-save-button:hover {
      background-color: var(--button-hover-background-color);
    }

    .pinecone-close-button {
      background-color: #6c757d;
      margin-left: 10px;
    }

    .pinecone-close-button:hover {
      background-color: #545b62;
    }

    
    @media (max-width: 768px) {
      .pinecone-modal-content {
        width: 95%; 
      }
      .pinecone-input-label {
          font-weight: normal; 
      }
    }
  `;
    document.head.appendChild(style);

    await loadTiktoken();

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function saveConfig() {
        const pineconeHost = document.getElementById('pinecone-host').value;
        const pineconeApiKey = document.getElementById('pinecone-api-key').value;
        const pineconeNamespace = document.getElementById('pinecone-namespace').value;
        const openaiModel = document.getElementById('openai-model').value;
        let embeddingDimension = document.getElementById('embedding-dimension').value;

        if (!embeddingDimension) {
            embeddingDimension = '';
        }

        const openaiApiKey = document.getElementById('openai-api-key').value;

        localStorage.setItem('saveExtension-pinecone-host', pineconeHost);
        localStorage.setItem('saveExtension-pinecone-api-key', pineconeApiKey);
        localStorage.setItem('saveExtension-pinecone-namespace', pineconeNamespace);
        localStorage.setItem('saveExtension-openai-model', openaiModel);
        localStorage.setItem('saveExtension-embedding-dimension', embeddingDimension);
        localStorage.setItem('saveExtension-pinecone-openai-api-key', openaiApiKey);

        const savedIndicator = document.getElementById('config-saved-indicator');
        if (savedIndicator) {
            savedIndicator.textContent = 'Saved!';
            savedIndicator.style.color = 'green';
            setTimeout(() => {
                savedIndicator.textContent = '';
            }, 2000);
        }
    }

    const debouncedSaveConfig = debounce(saveConfig, 500);

    function showConfigModal() {
        let existingModal = document.getElementById('pinecone-config-modal');
        if (existingModal) {
            existingModal.remove();
        }

        let modal = document.createElement('div');
        modal.id = 'pinecone-config-modal';
        modal.className = 'pinecone-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'pinecone-modal-content';

        const inputContainer = document.createElement('div');
        inputContainer.id = 'pinecone-config-inputs';
        inputContainer.className = 'pinecone-config-inputs';

        function createInputField(labelText, id, type = 'text', placeholder = '', required = true, value = '', description = '') {
            const label = document.createElement('label');
            label.textContent = labelText;
            label.htmlFor = id;
            label.className = 'pinecone-input-label';

            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.name = id;
            input.placeholder = placeholder;
            input.required = required;
            input.value = value;
            input.className = 'pinecone-input-field';

            input.addEventListener('input', debouncedSaveConfig);

            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'pinecone-input-wrapper';
            inputWrapper.appendChild(label);
            inputWrapper.appendChild(input);

            if (description) {
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = description;
                descriptionElement.className = 'pinecone-input-description';
                inputWrapper.appendChild(descriptionElement);
            }

            inputContainer.appendChild(inputWrapper);
        }

        createInputField('Pinecone Index Host URL:', 'pinecone-host', 'text', 'your-index-host.pinecone.io', true, localStorage.getItem('saveExtension-pinecone-host') || '', 'The URL of your Pinecone index.');
        createInputField('Pinecone API Key:', 'pinecone-api-key', 'password', 'Your Pinecone API Key', true, localStorage.getItem('saveExtension-pinecone-api-key') || '', 'Your Pinecone API key.');
        createInputField('Namespace:', 'pinecone-namespace', 'text', 'chat01', true, localStorage.getItem('saveExtension-pinecone-namespace') || 'chat01', 'Specify a namespace for this chat. Use a unique namespace to prevent data conflicts.');
        createInputField('OpenAI Embedding Model:', 'openai-model', 'text', 'text-embedding-3-small', true, localStorage.getItem('saveExtension-openai-model') || 'text-embedding-3-small', 'The OpenAI embedding model.');
        createInputField('Embedding Dimension (Optional):', 'embedding-dimension', 'number', '', false, localStorage.getItem('saveExtension-embedding-dimension') || '', 'The dimension of the embedding vector.');

        let openaiApiKey = localStorage.getItem('saveExtension-pinecone-openai-api-key') || (localStorage.getItem('TM_useAPIKey') ? JSON.parse(localStorage.getItem('TM_useAPIKey')) : '') || '';
        createInputField('OpenAI API Key:', 'openai-api-key', 'password', 'Your OpenAI API Key', true, openaiApiKey, 'Your OpenAI API key.');

        const savedIndicator = document.createElement('span');
        savedIndicator.id = 'config-saved-indicator';
        savedIndicator.className = 'pinecone-saved-indicator';
        inputContainer.appendChild(savedIndicator);

        const saveToPineconeButton = document.createElement('button');
        saveToPineconeButton.type = 'button';
        saveToPineconeButton.textContent = 'Save Chat to Pinecone';
        saveToPineconeButton.className = 'pinecone-button pinecone-save-button';
        saveToPineconeButton.onclick = () => {
            getAndProcessChatData();
            modal.remove();
        };
        inputContainer.appendChild(saveToPineconeButton);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = 'Close';
        closeButton.className = 'pinecone-button pinecone-close-button';
        closeButton.onclick = () => {
            modal.remove();
        };
        inputContainer.appendChild(closeButton);

        modalContent.appendChild(inputContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    function addSaveButton() {
        const settingsButton = document.querySelector('button[data-element-id="workspace-tab-settings"]');
        if (!settingsButton) {
            console.warn("Settings button not found.");
            return;
        }

        const buttonContainer = settingsButton.closest('div');
        if (!buttonContainer) {
            console.warn("Button container not found.");
            return;
        }

        const saveButton = document.createElement('button');
        saveButton.setAttribute('data-element-id', 'workspace-tab-save-to-pinecone');
        saveButton.style.color = window.getComputedStyle(buttonContainer).color;
        saveButton.style.fontFamily = window.getComputedStyle(buttonContainer).fontFamily;
        saveButton.style.alignItems = "center";
        saveButton.className = settingsButton.className;

        const buttonSpan = document.createElement('span');
        buttonSpan.className = settingsButton.querySelector('span').className;

        const iconSpan = document.createElement('span');
        const iconSpanInSettings = settingsButton.querySelector('span > svg');
        if (iconSpanInSettings) {
            iconSpan.className = iconSpanInSettings.className;
        } else {
            iconSpan.className = 'w-4 h-4 flex-shrink-0';
        }

        iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64" fill="currentColor" class="w-4 h-4 flex-shrink-0"><path d="M31 48V3M16 20L31 3l15 16" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" fill="none"/><path d="M8 46v16h46V46" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" fill="none"/></svg>`;

        const labelSpan = document.createElement('span');
        const labelSpanInSettings = settingsButton.querySelector('span > span');
        if (labelSpanInSettings) {
            labelSpan.className = labelSpanInSettings.className;
        } else {
            labelSpan.className = 'font-normal self-stretch text-center text-xs leading-4 md:leading-none';
        }
        labelSpan.textContent = 'Save';

        buttonSpan.appendChild(iconSpan);
        buttonSpan.appendChild(labelSpan);
        saveButton.appendChild(buttonSpan);

        saveButton.onclick = () => {
            showConfigModal();
        };

        settingsButton.parentElement.insertBefore(saveButton, settingsButton.nextSibling);
    }

    async function loadTiktoken() {
        if (typeof Tiktoken !== 'undefined') return;
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    Tiktoken
                } = await import('https://esm.sh/js-tiktoken@1.0.19/lite');
                window.Tiktoken = Tiktoken;
                resolve();
            } catch (error) {
                reject(new Error('Failed to load js-tiktoken library: ' + error));
            }
        });
    }

    async function fetchEncoding(encodingName) {
        const res = await fetch(`https://tiktoken.pages.dev/js/${encodingName}.json`);
        if (!res.ok) {
            throw new Error(`Failed to fetch encoding: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    }

    function getEncodingName(modelName) {
        switch (modelName) {
            case 'text-embedding-ada-002':
                return 'cl100k_base';
            case 'text-embedding-3-small':
                return 'o200k_base';
            case 'text-embedding-3-large':
                return 'o200k_base';
            default:
                throw new Error(`Unsupported embedding model: ${modelName}`);
        }
    }

    async function embedChatData(pineconeData) {
        try {
            await loadTiktoken();
            const openaiApiKey = localStorage.getItem('saveExtension-pinecone-openai-api-key');
            const openaiModel = localStorage.getItem('saveExtension-openai-model');
            const embeddingDimension = localStorage.getItem('saveExtension-embedding-dimension');
            if (!openaiApiKey || !openaiModel) throw new Error('OpenAI API key and model must be configured.');
            const encodingName = getEncodingName(openaiModel);
            const encodingData = await fetchEncoding(encodingName);
            const encoder = new Tiktoken(encodingData);
            const messages = pineconeData.messages;
            const embeddedMessages = [];
            const overlapSize = 1;
            let currentBatch = [];
            let currentBatchTokens = 0;
            let previousBatchTail = [];
            const tokenCache = {};
            const baseMaxTokens = 8191;
            const minSafetyMargin = 50;
            const metadataSizeFactor = 0.1;

            function byteSize(str) {
                return new Blob([str]).size;
            }

            for (const message of messages) {
                const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
                let messageTokens = tokenCache[content];
                if (messageTokens === undefined) {
                    messageTokens = encoder.encode(content).length;
                    tokenCache[content] = messageTokens;
                }
                const metadata = {
                    chat_id: message.chat_id,
                    message_number: message.message_number,
                    role: message.role,
                    content: message.content
                };
                const metadataSize = byteSize(JSON.stringify(metadata));
                const dynamicSafetyMargin = Math.max(minSafetyMargin, metadataSizeFactor * metadataSize);
                const maxTokens = baseMaxTokens - dynamicSafetyMargin;
                if (currentBatchTokens + messageTokens > maxTokens && currentBatch.length > 0) {
                    const embeddings = await getEmbeddings(currentBatch, openaiApiKey, openaiModel, embeddingDimension);
                    embeddedMessages.push(...embeddings);
                    previousBatchTail = currentBatch.slice(-overlapSize);
                    currentBatch = [...previousBatchTail];
                    currentBatchTokens = previousBatchTail.reduce((sum, msg) => {
                        const msgContent = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
                        let cachedTokens = tokenCache[msgContent];
                        if (cachedTokens === undefined) {
                            cachedTokens = encoder.encode(msgContent).length;
                            tokenCache[msgContent] = cachedTokens;
                        }
                        return sum + cachedTokens;
                    }, 0);
                }
                currentBatch.push({
                    ...message,
                    content
                });
                currentBatchTokens += messageTokens;
            }
            if (currentBatch.length > 0) {
                const embeddings = await getEmbeddings(currentBatch, openaiApiKey, openaiModel, embeddingDimension);
                embeddedMessages.push(...embeddings);
            }
            return embeddedMessages;
        } catch (error) {
            throw error;
        }
    }

    async function getEmbeddings(messages, apiKey, model, dimensions) {
        const inputs = messages.map(message => {
            let content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);

            if (content.trim() === "") {
                content = " ";
            }
            return content;
        });

        const requestBody = {
            input: inputs,
            model: model,
        };

        if (dimensions) {
            requestBody.dimensions = parseInt(dimensions, 10);
        }

        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        const results = data.data.map((embeddingData, index) => {
            const message = messages[embeddingData.index];
            return {
                id: `${message.chat_id}-message${message.message_number}`,
                values: embeddingData.embedding,
                metadata: {
                    chat_id: message.chat_id,
                    message_number: message.message_number,
                    role: message.role,
                    content: message.content,
                },
            };
        });

        return results;
    }

    async function upsertToPinecone(embeddedData) {
        try {
            let pineconeHost = localStorage.getItem('saveExtension-pinecone-host');
            const pineconeApiKey = localStorage.getItem('saveExtension-pinecone-api-key');
            const pineconeNamespace = localStorage.getItem('saveExtension-pinecone-namespace');

            if (!pineconeHost || !pineconeApiKey || !pineconeNamespace) {
                throw new Error('Pinecone host, API key, and namespace must be configured.');
            }

            pineconeHost = pineconeHost.replace(/^https?:\/\//, '');
            const pineconeUrl = `https://${pineconeHost}/vectors/upsert`;
            const batchSize = 1000;
            for (let i = 0; i < embeddedData.length; i += batchSize) {
                const batch = embeddedData.slice(i, i + batchSize);
                const requestBody = {
                    vectors: batch,
                    namespace: pineconeNamespace,
                };

                const response = await fetch(pineconeUrl, {
                    method: 'POST',
                    headers: {
                        'Api-Key': pineconeApiKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Pinecone API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
                }
            }
            alert('Chat data saved to Pinecone successfully!');

        } catch (error) {
            console.error('Error in upsertToPinecone:', error);
            alert('An error occurred while upserting data to Pinecone: ' + error.message);
        }
    }

    async function openDB() {
        return new Promise((resolve, reject) => {
            const dbName = 'keyval-store';
            const request = indexedDB.open(dbName);

            request.onsuccess = () => {
                const db = request.result;
                resolve(db);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async function getChatByID(db, chatID) {
        return new Promise((resolve, reject) => {
            const objectStoreName = 'keyval';
            const transaction = db.transaction([objectStoreName], 'readonly');
            const store = transaction.objectStore(objectStoreName);
            const key = `CHAT_${chatID}`;
            const request = store.get(key);

            request.onsuccess = () => {
                const chat = request.result;
                if (chat) {
                    resolve(chat);
                } else {
                    reject(new Error('Chat not found.'));
                }
            };
            request.onerror = () => {
                reject(request.error);
            };
            transaction.oncomplete = () => {
                db.close();
            }
        });
    }

    async function getAndProcessChatData() {
        try {
            const chatIDFromURL = window.location.hash.match(/#chat=([^&]+)/);
            if (!chatIDFromURL || !chatIDFromURL[1]) {
                alert('No chat selected.');
                return;
            }
            const chatID = chatIDFromURL[1];

            const db = await openDB();
            const chat = await getChatByID(db, chatID);

            const chat_id = chat.chatID || chat.id || '';
            const chatTitle = chat.chatTitle || chat.title || 'Untitled Chat';
            const messages = chat.messages || chat.conversation || [];

            const pineconeData = {
                chat_id: chat_id,
                chatTitle: chatTitle,
                messages: messages.map((message, index) => ({
                    message_number: index,
                    content: message.content,
                    createdAt: message.createdAt,
                    role: message.role,
                    chat_id: chat_id,
                })),
            };

            const embeddedData = await embedChatData(pineconeData);
            await upsertToPinecone(embeddedData);

        } catch (error) {
            console.error('Error in getAndProcessChatData:', error);
            alert('An error occurred while processing and saving chat data: ' + error.message);
        }
    }

    addSaveButton();
})();
