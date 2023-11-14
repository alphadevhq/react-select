import SemiCircleIcon from './semi-circle-icon';

const Loading = ({ loading = false }) => {
  if (!loading) return null;
  return (
    <div className="zener-animate-spin zener-flex zener-mx-0.5">
      <SemiCircleIcon size={16} />
    </div>
  );
};

export default Loading;
