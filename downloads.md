# How to Add and Update Downloads

This guide provides detailed instructions on how to add and update downloads on the Twoem Online Productions website.

## Adding a New Download

To add a new download, you need to perform two main steps:

1.  **Upload the file** to the appropriate directory on the server.
2.  **Update the website code** to display the new download link.

### Step 1: Upload the File

Connect to the server using an FTP client or the file manager provided by your hosting provider. Navigate to the `public/downloads` directory.

*   For **public documents** (e.g., forms, brochures), upload the file to the `public/downloads/public` directory.
*   For **eulogy documents**, upload the file to the `public/downloads/eulogies` directory.

### Step 2: Update the Website Code

Open the `views/downloads.ejs` file in a text editor.

#### For Public Documents

Find the `<ul>` element inside the `<section class="public-documents">`. Add a new `<li>` element for your new download, following this format:

```html
<li><a href="/download?file=public/your-file-name.pdf">Your Document Title</a></li>
```

Replace `your-file-name.pdf` with the exact filename of the uploaded document, and `Your Document Title` with the desired display text.

#### For Eulogy Documents

Find the `<ul>` element inside the `<section class="eulogy-documents">`. Add a new `<li>` element for the new eulogy, following this format:

```html
<li>
  <a href="/download?file=eulogies/eulogy-for-john-doe.pdf">Eulogy for John Doe</a>
  <span>Expires in 7 days</span>
</li>
```

Replace `eulogy-for-john-doe.pdf` with the exact filename, update the title, and set the expiration notice accordingly.

## Updating an Existing Download

To update an existing download, simply replace the old file on the server with the new one, making sure the filename remains the same. If you need to change the filename, you must also update the corresponding link in `views/downloads.ejs`.

## Deleting a Download

To delete a download, remove the file from the server and delete the corresponding `<li>` element from `views/downloads.ejs`.

---

By following these instructions, you can easily manage the downloadable content on the website.
