# TypingMind Extension: Save Chat to Pinecone

This TypingMind extension allows you to save your chat conversations directly to a Pinecone vector database for long-term storage and retrieval.

## Installation

To install this extension, use the following CDN link: https://cdn.jsdelivr.net/gh/Btran1291/TMExtension-SavetoPinecone@latest/saveToPinecone.min.js 

**Instructions:**

1.  Open TypingMind.
2.  Go to **Settings**
3.  Navigate to **Advanced Settings**.
4.  Find the **Extensions** section.
5.  Enter the CDN link above into the "Enter extension URL" field.
6.  Click **Install**.
7.  **Restart** TypingMind for the extension to take effect.

## Configuration

After installing the extension, you need to configure your Pinecone and OpenAI credentials.

**Instructions:**

1.  Open TypingMind and select a chat.
2.  You should see a new button labeled **Save** next to the Settings button. Click this button.
3.  A configuration modal will appear.  Enter the following information:

    *   **Pinecone Index Host URL:** The URL of your Pinecone index (e.g., `your-index-host.pinecone.io`).  *`https://` is optional*.
    *   **Pinecone API Key:** Your Pinecone API key.
    *   **Namespace:**  A namespace for this chat (e.g., `chat01`). To avoid data overwritting, use a different namespace for each chat.
    *   **OpenAI Embedding Model:** The OpenAI embedding model to use (e.g., `text-embedding-3-small`).  See OpenAI's documentation for available models.
    *   **Embedding Dimension (Optional):** The dimension of the embedding vector. Only enter if you want to use a specific dimension other than the default one.
    *   **OpenAI API Key:** Your OpenAI API key. This should be fetched automatically.

4.  Click **Save Chat to Pinecone** to save the current chat to your Pinecone index OR **Close** to close the configuration modal.
5.  Use [Memory Recall plugin](https://github.com/Btran1291/TMPlugin-MemoryRecall) to start retrieving chat data.

## Contributing

Contributions are welcome!  Feel free to submit pull requests or open issues.

## License

This extension is licensed under the MIT License.
