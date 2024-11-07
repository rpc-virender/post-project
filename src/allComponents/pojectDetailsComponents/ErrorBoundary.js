import React, { Fragment, useState } from 'react';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = (error) => {
        console.error("Error occurred: ", error);
        setHasError(true);
    };

    return (
        <Fragment>
            {hasError ? (
                <h1>Something went wrong.</h1>
            ) : (
                <React.ErrorBoundary
                    FallbackComponent={() => <h1>Something went wrong.</h1>}
                    onError={handleError}
                >
                    {children}
                </React.ErrorBoundary>
            )}
        </Fragment>
    );
};

export default ErrorBoundary;
