import { useEffect, useRef, forwardRef, useState, RefObject } from "react"
import { loadAndApplyBackground, storeImage, applyThreadSettings } from "../Utils/SettingsUtils";
import { fetchSettings, saveSettings } from "../Utils/Data";


type SettingsDialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>;
};

export default function SettingsDialog({ dialogRef }: SettingsDialogProps) {
    // const dialogRef = useRef<HTMLDialogElement>(null);
    const bgRef = useRef<HTMLInputElement>(null);
    const threadWidthRef = useRef<HTMLInputElement>(null);
    const threadOpacityRef = useRef<HTMLInputElement>(null);
    const threadBlurRef = useRef<HTMLInputElement>(null);
    const [threadWidth, setThreadWidth] = useState(300);
    const [threadOpacity, setThreadOpacity] = useState(0.9);
    const [threadBlur, setThreadBlur] = useState(40);

    useEffect(() => {
        loadAndApplyBackground();
        fetchSettings().then(settings => {
            setThreadWidth(settings.threadWidth ?? 300);
            setThreadOpacity(settings.threadOpacity ?? 0.9);
            setThreadBlur(settings.threadBlur ?? 40);
        });
    }, []);

    useEffect(() => {
        requestAnimationFrame(() =>
            applyThreadSettings({ threadWidth, threadOpacity, threadBlur })
        );
    }, [threadWidth, threadOpacity, threadBlur]);

    const confirm = async () => {
        const file = bgRef.current?.files?.[0];
        if (file) {
            await storeImage(file);
            await loadAndApplyBackground();
        }

        try {
            const settings = await fetchSettings();
            const newWidthStr = threadWidthRef.current?.value;
            const newOpacity_ = threadOpacityRef.current?.value;
            const newBlur_ = threadBlurRef.current?.value;

            if (!newWidthStr) throw new Error("no width");
            if (!newOpacity_) throw new Error("no opacity");

            const newWidth = parseInt(newWidthStr, 10);
            const newOpacity = parseFloat(newOpacity_!);
            const newBlur = parseFloat(newBlur_!);

            await saveSettings({
                ...settings,
                threadWidth: newWidth,
                threadOpacity: newOpacity,
                threadBlur: newBlur,
            });

            setThreadWidth(newWidth);
            setThreadOpacity(newOpacity);
            setThreadBlur(newBlur);

        } catch (err) {
            console.log("Failed to save width:", err);
        }

        dialogRef.current?.close();
    };

    const cancel = () => dialogRef.current?.close();

    return (
        <dialog ref={dialogRef} id="settings-dialog" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h2 className="font-bold text-3xl text-center">Settings</h2>

                <BackgroundImage ref={bgRef} />
                <ThreadWidth ref={threadWidthRef} width={threadWidth} />
                <ThreadOpacity ref={threadOpacityRef} opacity={threadOpacity} />
                <ThreadBlur ref={threadBlurRef} blur={threadBlur} />

                <div className="modal-action">
                    <button className="btn" onClick={cancel}>Cancel</button>
                    <button className="btn" onClick={confirm}>OK</button>
                </div>
            </div>
        </dialog>
    );
}

const BackgroundImage = forwardRef<HTMLInputElement>((_props, ref) => {
    return (
        <fieldset className="fieldset center mt-7">
            <legend className="fieldset-legend text-xl">Pick a background image</legend>
            <input ref={ref} type="file" accept="image/*" className="file-input place-self-center" />
        </fieldset>
    );
});

const ThreadWidth = forwardRef<HTMLInputElement, { width?: number }>(({ width }, ref) => {
    const [value, setValue] = useState(width);

    useEffect(() => {
        setValue(width);
    }, [width]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value, 10));
    };

    return (
        <div className="mt-7 w-full">
            <div className="text-xl"><b>Thread Width:</b> {value}</div>
            <input
                onChange={handleChange}
                ref={ref}
                type="range"
                min={250}
                max={600}
                value={value}
                className="range range-lg w-full"
            />
        </div>
    );
});

const ThreadOpacity = forwardRef<HTMLInputElement, { opacity?: number }>(({ opacity }, ref) => {
    const [value, setValue] = useState(opacity);

    useEffect(() => {
        setValue(opacity);
    }, [opacity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseFloat(e.target.value));
    };

    return (
        <div className="mt-7 w-full">
            <div className="text-xl"><b>Thread Opacity:</b> {value}</div>
            <input
                onChange={handleChange}
                ref={ref}
                type="range"
                step={0.01}
                min={0.0}
                max={1.0}
                value={value}
                className="range range-lg w-full"
            />
        </div>
    );
});

const ThreadBlur = forwardRef<HTMLInputElement, { blur?: number }>(({ blur }, ref) => {
    const [value, setValue] = useState(blur);

    useEffect(() => {
        setValue(blur);
    }, [blur]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseFloat(e.target.value));
    };

    return (
        <div className="mt-7 w-full">
            <div className="text-xl"><b>Thread Blur:</b> {value}</div>
            <input
                onChange={handleChange}
                ref={ref}
                type="range"
                step={1}
                min={0}
                max={100}
                value={value}
                className="range range-lg w-full"
            />
        </div>
    );
});
