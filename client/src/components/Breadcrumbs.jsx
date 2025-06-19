const Breadcrumbs = ({ items }) => {
  return (
    <nav className="text-sm text-gray-500 mb-4">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.link ? (
            <a href={item.link} className="text-blue-600 hover:underline">{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
          {idx < items.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;