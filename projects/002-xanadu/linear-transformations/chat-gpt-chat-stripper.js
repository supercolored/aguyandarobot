// Copy Chat-GPT Conversation to Clipboard
(function() {
    const MODEL_SELECTOR = '.flex.w-full.items-center.justify-center.gap-1.border-b.bg-gray-50.p-3.text-gray-500';
    const CONVO_SELECTOR = '.relative.flex.flex-col.gap-1 > .flex.flex-grow.flex-col.gap-3 > .min-h-\\[20px\\].flex.flex-col.items-start.gap-4.whitespace-pre-wrap';
    const modelName = document.querySelector(MODEL_SELECTOR)?.innerHTML;
    const convoNodes = document.querySelectorAll(CONVO_SELECTOR);
    const convo = Array.from(convoNodes).map(a => a.innerHTML);
    copy([modelName, ...convo]);
    console.log('Copied converstion to clipboard.');
})();
