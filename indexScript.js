import Rave from "./Rave/js/Rave.js";
const richi = Rave ? new Rave("UI 2 Beta", "keyzarichi.org") : null;
richi.initializeIndexPath();

const peopleImg = document.querySelectorAll(".people .people-img img");
peopleImg.forEach((e) => {
    e.setAttribute("fetchpriotity", "low");
});
const dialogBetaWarning = document.getElementById("myDialog"),
disableMsg = document.getElementById("disable-early-message"),
isDisabled = "true" === localStorage.getItem("disable-warning"),
dialogClose = document.getElementById("close");

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        isDisabled ? dialogBetaWarning.close() : dialogBetaWarning.showModal();
    }, 1e3);
});
disableMsg.addEventListener("change", () => {
    disableMsg.checked ? localStorage.setItem("disable-warning", "true") : localStorage.setItem("disable-warning", "false");
});
dialogClose.addEventListener("click", () => {
    requestAnimationFrame(() => {
        dialogBetaWarning.style.animation = "fadeOut .8s cubic-bezier(0.075, 0.82, 0.165, 1)";
        dialogBetaWarning.addEventListener("animationend", () => {
        dialogBetaWarning.close();
        dialogBetaWarning.style.animation.includes("windows8ScaleOut");
    });
});
disableMsg.addEventListener("change", () => {
    disableMsg.checked
    ? localStorage.setItem("disable-warning", "true")
    : localStorage.setItem("disable-warning", "false");
});
});

const labelTags = document.querySelectorAll(".people .labelTag"),
now = new Date(),
DATE_IN_MS = 864e5,
EXPIRE_DAYS = 7;

labelTags.forEach((e) => {
    if ("Baru" === !e.textContent.trim() || "New" === !e.textContent.trim())
        return;
        const t = new Date(e.dataset.added);
        (now - t) / DATE_IN_MS > EXPIRE_DAYS && e.classList.add("hidden");
});

const timeline = ".timeline",
timelineItems = ".timeline-item",
features = ".features",
featuresItem = ".features .flex-box",
sections = ".section",
sectionTitleCtr = '.section-header.stylish',
sectionTitle = '.section-header.stylish .section-title',
main = "#scroll";
richi.intersectElements(timeline, timelineItems, "translateY", 10);
richi.intersectElements(features, featuresItem, "translateY", 50);
richi.intersectElements(sectionTitle, sectionTitleCtr, "translateX", 50);
richi.intersectElements(main, sections, "translateY", 100);
richi.animateOnScroll('.people', {
    target: '.people *',
    stagger: 0.09
})
richi.animateCounter();

const url = "./json/peopleBio.json";
fetch(url)
    .then(res => res.json())
    .then(data => {
        const map = new Map();

        document.querySelectorAll(".people-bio").forEach(el => {
            const key = el.dataset.people;

            if (!map.has(key)) {
                map.set(key, []);
            }

            map.get(key).push(el);
        });

        data.forEach(person => {
            const elements = map.get(String(person.id));
            if (!elements) return;

            elements.forEach(el => {
                const container = el.closest(".people");

                const name = el.querySelectorAll(".name h2");
                const nickname = el.querySelectorAll(".name span");
                const desc = el.querySelectorAll("p");
                const likeBtn = container.querySelector(".people-btns .like-count");

                // Handle like button
                if (likeBtn) {
                    const saved = parseInt(localStorage.getItem(`likeCount_${person.id}`));

                    if (!isNaN(saved)) {
                        person.like_count = saved;
                    }

                    likeBtn.textContent = person.like_count;

                    if (!likeBtn.dataset.bound) {
                        likeBtn.dataset.bound = "true";

                        likeBtn.addEventListener("click", () => {
                            const liked = likeBtn.classList.toggle("liked");

                            person.like_count += liked ? 1 : -1;
                            likeBtn.textContent = person.like_count;

                            localStorage.setItem(
                                `likeCount_${person.id}`,
                                person.like_count
                            );
                        });
                    }
                }

                // Set name
                name.forEach(n => {
                    n.textContent = person.name;
                });

                // Set nickname / alias
                nickname.forEach(nick => {
                    let text = person.nickname.replace(/&bull;/g, "/");

                    if (!person.aliases?.trim()) {
                        if (person.other_name?.trim()) {
                            text = `${person.other_name} | ${text}`;
                        }
                    }

                    nick.textContent = text;
                });

                // Set description
                desc.forEach(p => {
                    p.textContent = "";

                    if (!person.description?.trim()) {
                        p.textContent = "Tidak ada biografi";
                        p.classList.add("empty");
                        return;
                    }

                    const lines = person.description
                        .replace(/&bull;/g, "•")
                        .split("<br>");

                    const fragment = document.createDocumentFragment();

                    lines.forEach((line, i) => {
                        fragment.appendChild(document.createTextNode(line.trim()));

                        if (i < lines.length - 1) {
                            fragment.appendChild(document.createElement("br"));
                        }
                    });

                    p.appendChild(fragment);
                });

                const profileImg = container.querySelector(".people-img img");
                const link = container.querySelector(".people-btns a");

                if (profileImg) {
                    profileImg.alt = `${person.name}'s profile picture.`;
                }

                if (link) {
                    link.ariaLabel = `Learn more about ${person.nickname}`;
                }
            });
        });
    })
    .catch((e) => console.error("Error fetching people JSON: ", e));
