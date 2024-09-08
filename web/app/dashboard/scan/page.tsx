/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

function ScanPage() {
  const webcamRef = useRef<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | any>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setModalOpen(true);
    setImageSrc(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <div className="my-24">
        <div className="w-full flex justify-center">
          <div className="w-2/3 flex items-center justify-center border border-sky-600 rounded-md overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <button
            onClick={capture}
            className="w-2/3 gap-x-3 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Capture QR Code
          </button>
        </div>
      </div>

      {/* Modal with charger info start */}
      <Dialog open={modalOpen} onClose={setModalOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-5xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-white">
                    Pay Up
                  </DialogTitle>

                  <div>
                    <img src={imageSrc} alt="QR Code" className="rounded-md" />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Pay & Start Charging
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Modal with charger info end */}
    </>
  );
}

export default ScanPage;
