FROM mcr.microsoft.com/playwright:v1.23.0-focal

# Set the working directory
WORKDIR /playwright/

# Copy the run sript/s from local folder to the container's related folder and add execute permission
COPY /scripts/run-e2e-tests.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the HOME environment variable for the test project
ENV HOME=/playwright/project

# Set the file access permissions (read, write and access) recursively for the new folders
RUN chmod -Rf 777 .

# Container entry point
ENTRYPOINT ["/entrypoint.sh"]
