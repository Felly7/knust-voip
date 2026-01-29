# How to Host Your Website

Since your website is built with standard HTML, CSS, and JavaScript, it is incredibly easy to host for free. Here are the two best methods:

## Option 1: Netlify Drop (Easiest)
This method takes about 30 seconds and requires no code.

1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Locate your project folder: `c:\Users\felly\OneDrive\Desktop\KNUST VOIP`.
3.  **Drag and drop** that entire folder onto the area that says "Drag and drop your site folder here".
4.  Netlify will upload it and give you a live link (e.g., `https://calm-fudge-123.netlify.app`) immediately.
5.  You can share this link with anyone!

## Option 2: GitHub Pages (Best for Updates)
If you have a GitHub account:

1.  Log in to [GitHub](https://github.com).
2.  Create a **New Repository** (name it `knust-voip` or similar).
3.  Open your terminal in the project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/knust-voip.git
    git push -u origin main
    ```
4.  Go to your repository **Settings** -> **Pages**.
5.  Set the **Source** to `main` branch and save.
6.  GitHub will give you a link like `https://your-username.github.io/knust-voip`.

## Option 3: Verification
Before hosting, just double-click `index.html` on your computer to make sure all images appear correctly. Since we used local images, they will upload perfectly with the folder.
