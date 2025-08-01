/**
 * Componente de estado de erro para a aplicação
 */

import { ErrorState } from "@/components";
import PropTypes from "prop-types";

const AppErrorState = ({
  title = "Erro ao carregar o sistema",
  message,
  onRetry,
  retryText = "Recarregar Sistema",
}) => {
  return (
    <div className="min-h-screen bg-rd-gray-light flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <ErrorState
          title={title}
          message={message}
          onRetry={onRetry}
          retryText={retryText}
          variant="error"
        />
      </div>
    </div>
  );
};

AppErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  retryText: PropTypes.string,
};

export default AppErrorState;
