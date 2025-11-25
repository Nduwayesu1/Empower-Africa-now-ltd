const postForm = document.getElementById("postForm");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const postsContainer = document.getElementById("postsContainer");

// Simulate async operation
const simulateAsync = (callback, error = false) => {
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    setTimeout(() => {
        loadingEl.classList.add("hidden");
        if (error) {
            errorEl.textContent = "Something went wrong!";
            errorEl.classList.remove("hidden");
        } else {
            callback();
        }
    }, 500);
};

// Load posts from localStorage
let posts = JSON.parse(localStorage.getItem("posts") || "[]");

// Render all posts as cards
function renderPosts() {
    postsContainer.innerHTML = "";

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    posts.forEach((post, index) => {
        const card = document.createElement("div");
        card.classList.add("post-card");
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p class="meta">By <strong>${post.author}</strong> • ${post.time}</p>
            <p>${post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}</p>
            <div class="card-buttons">
                <button class="view-btn">View</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // View post in post.html
        card.querySelector(".view-btn").addEventListener("click", () => {
            localStorage.setItem("viewPostIndex", index);
            window.location.href = "./page/post.html"; // Adjust path
        });

        // Edit post inline
        card.querySelector(".edit-btn").addEventListener("click", () => {
            document.getElementById("title").value = post.title;
            document.getElementById("author").value = post.author;
            document.getElementById("content").value = post.content;
            currentEditIndex = index;
        });

        // Delete post
        card.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this post?")) {
                simulateAsync(() => {
                    posts.splice(index, 1);
                    localStorage.setItem("posts", JSON.stringify(posts));
                    renderPosts();
                });
            }
        });

        postsContainer.appendChild(card);
    });
}

// Current edit index
let currentEditIndex = null;

// Submit new post or save edit
postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !author || !content) {
        errorEl.textContent = "All fields are required!";
        errorEl.classList.remove("hidden");
        return;
    }

    simulateAsync(() => {
        const time = new Date().toLocaleString(); // timestamp

        if (currentEditIndex !== null) {
            // Edit existing post
            posts[currentEditIndex] = { title, author, content, time };
            currentEditIndex = null;
        } else {
            // Add new post
            posts.push({ title, author, content, time });
        }

        localStorage.setItem("posts", JSON.stringify(posts));
        postForm.reset();
        renderPosts();
    });
});

// Initial render
renderPosts();
