const facebookUrl = "https://www.facebook.com/profile.php?id=61578948302243";
const instagramUrl = "https://www.instagram.com/czestobusy.pl/";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M14.2 8.4V6.9c0-.7.5-.9.9-.9h2.1V2.5l-2.9-.1c-3.2 0-4.9 1.9-4.9 5.2v.8H6.8V12h2.6v9.6h4V12h3l.5-3.6h-3.7Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7.8 2.5h8.4c3 0 5.3 2.3 5.3 5.3v8.4c0 3-2.3 5.3-5.3 5.3H7.8c-3 0-5.3-2.3-5.3-5.3V7.8c0-3 2.3-5.3 5.3-5.3Zm0 3.3a2 2 0 0 0-2 2v8.4a2 2 0 0 0 2 2h8.4a2 2 0 0 0 2-2V7.8a2 2 0 0 0-2-2H7.8Zm4.2 2.1a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2Zm0 2.8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm4.5-3.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
  </svg>
);

export function HeaderSocials() {
  return (
    <div className="header-socials" aria-label="Media spolecznosciowe">
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook CzestoBusy">
        <FacebookIcon />
      </a>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram CzestoBusy">
        <InstagramIcon />
      </a>
    </div>
  );
}
