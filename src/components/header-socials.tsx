const facebookUrl = "https://www.facebook.com/profile.php?id=61578948302243";
const instagramUrl = "https://www.instagram.com/czestobusy.pl/";

export function HeaderSocials() {
  return (
    <div className="header-socials" aria-label="Media spolecznosciowe">
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook CzestoBusy">
        <span aria-hidden="true">f</span>
      </a>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram CzestoBusy">
        <span aria-hidden="true">ig</span>
      </a>
    </div>
  );
}
