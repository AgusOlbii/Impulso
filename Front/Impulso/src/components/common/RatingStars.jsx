import Icon from "./Icon";

function RatingStars({ value = 0, onChange, disabled }) {
  return (
    <div className="star-rate">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          className={score <= value ? "active" : ""}
          disabled={disabled}
          onClick={() => onChange?.(score)}
          aria-label={`${score} estrellas`}
        >
          <Icon name="star" size={18} />
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
