/**
 * Componente de estado de loading para a aplicação
 */

import { LoadingState } from "@/components";
import PropTypes from "prop-types";

const AppLoadingState = ({
  message = "Carregando...",
  description,
  size = "large",
}) => {
  return (
    <div className="min-h-screen bg-rd-gray-light flex flex-col justify-center items-center">
      <div className="text-center max-w-md">
        <LoadingState message={message} size={size} />
        {description && <p className="text-rd-gray mt-4">{description}</p>}
      </div>
    </div>
  );
};

AppLoadingState.propTypes = {
  message: PropTypes.string,
  description: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default AppLoadingState;
