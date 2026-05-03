const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'No data to display',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="text-7xl mb-6 animate-float">{icon}</div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
