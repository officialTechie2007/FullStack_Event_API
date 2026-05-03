import GlassCard from './GlassCard';

const Card = (props) => {
  const rest = { ...props };
  delete rest.animate;
  delete rest.glass;
  return <GlassCard {...rest} />;
};

export default Card;
