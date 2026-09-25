// Typing Effect
const texts = [
  "✨ Manage your tasks effortlessly",
  "📝 Capture your ideas instantly",
  "💪 Track your habits daily",
  "🚀 Stay productive, stay organized",
];

let textIndex = 0,
  charIndex = 0,
  isDeleting = false;
const typingElement = document.getElementById("typingText");

function typeEffect() {
  const currentText = texts[textIndex];
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }
  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => {
      isDeleting = true;
    }, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    setTimeout(typeEffect, 500);
    return;
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100);
}
typeEffect();

console.log("🌌 ORBIT — Welcome!");
