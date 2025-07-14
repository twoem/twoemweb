# How to Add Downloads

To add a new download to the website, follow these steps:

1.  **Upload the file:** Add the file to the `public/downloads/public` directory for public documents, or the `public/downloads/eulogies` directory for eulogy documents.

2.  **Update the downloads page:** Open the `views/downloads.ejs` file and add a new list item with a link to the file.

    For public documents, add the following code to the `public-documents` section:

    ```html
    <li><a href="/download?file=public/your-file-name.pdf">Your File Name</a></li>
    ```

    For eulogy documents, add the following code to the `eulogy-documents` section:

    ```html
    <li>
      <a href="/download?file=eulogies/your-file-name.pdf">Eulogy for ...</a>
      <span>Expires in ... days</span>
    </li>
    ```

3.  **Replace placeholders:** Replace `your-file-name.pdf` with the actual file name, and update the link text and expiration notice as needed.
