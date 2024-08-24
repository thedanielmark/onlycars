import { useEffect } from "react";
import { getRedisClient } from "@/utils/redis";
import { run, HandlerContext } from "@xmtp/message-kit";
import { startCron } from "@/utils/cron";

const Chat = () => {
  useEffect(() => {
    const inMemoryCacheStep = new Map<string, number>();
    const stopWords = ["stop", "unsubscribe", "cancel", "list"];

    const initializeClient = async () => {
      const redisClient = await getRedisClient();
      let clientInitialized = false;

      run(async (context: HandlerContext) => {
        const {
          client,
          message: {
            content: { content: text },
            typeId,
            sender,
          },
        } = context;

        if (!clientInitialized) {
          startCron(redisClient, client);
          clientInitialized = true;
        }

        if (typeId !== "text") {
          return;
        }

        const lowerContent = text?.toLowerCase();

        if (stopWords.some((word) => lowerContent.includes(word))) {
          inMemoryCacheStep.set(sender.address, 0);
          await redisClient.del(sender.address);
          await context.reply(
            "You are now unsubscribed. You will no longer receive updates!."
          );
        }

        const cacheStep = inMemoryCacheStep.get(sender.address) || 0;
        let message = "";

        if (cacheStep === 0) {
          message = "Welcome! Choose an option:\n1. Info\n2. Subscribe";
          inMemoryCacheStep.set(sender.address, cacheStep + 1);
        } else if (cacheStep === 1) {
          if (text === "1") {
            message = "Here is the info.";
          } else if (text === "2") {
            await redisClient.set(sender.address, "subscribed");
            message =
              "You are now subscribed. You will receive updates.\n\ntype 'stop' to unsubscribe";
            inMemoryCacheStep.set(sender.address, 0);
          } else {
            message =
              "Invalid option. Please choose 1 for Info or 2 to Subscribe.";
          }
        } else {
          message = "Invalid option. Please start again.";
          inMemoryCacheStep.set(sender.address, 0);
        }

        await context.reply(message);
      });
    };

    initializeClient();
  }, []);

  return <div>My Component is running...</div>;
};

export default Chat;
