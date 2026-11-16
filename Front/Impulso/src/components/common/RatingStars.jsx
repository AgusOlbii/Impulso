import Icon from "./Icon";

function RatingStars({ value = 0, onChange, disabled }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "active" : ""}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!disabled) onChange?.(star);
          }}
          aria-label={`${star} estrella${star === 1 ? "" : "s"}`}
        >
          <Icon name="star" size={20} />
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
