
import java.io.IOException;
import java.util.logging.*;

public class AppLogger {

    private static final Logger LOGGER = Logger.getLogger(AppLogger.class.getName());

    public static void main(String[] args) throws IOException {
        FileHandler fileHandler = new FileHandler("app.log", true);
        fileHandler.setFormatter(new SimpleFormatter());
        LOGGER.addHandler(fileHandler);
        LOGGER.setLevel(Level.INFO);
        LOGGER.info("Starting process...");
        LOGGER.info("Step completed");
    }
}
