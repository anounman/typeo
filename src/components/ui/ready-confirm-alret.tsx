import { AlertTriangle, X } from "lucide-react";

export const ReadyConfirmAlert = ({setShowReadyAlert , handleReadyConfirm} : {setShowReadyAlert : React.Dispatch<React.SetStateAction<boolean>> ,  handleReadyConfirm : () => void}) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md shadow-2xl border border-slate-700 transform transition-all animate-scaleIn">
        <div className="flex items-start mb-4">
          <div className="bg-amber-500/20 p-3 rounded-lg mr-4">
            <AlertTriangle size={24} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ready Confirmation
            </h3>
            <p className="text-slate-300 mb-2">
              Once you mark yourself as ready, you{" "}
              <span className="text-amber-400 font-medium">cannot undo</span>{" "}
              this action.
            </p>
            <p className="text-slate-400 text-sm">
              The race will begin when all players are ready.
            </p>
          </div>
          <button
            onClick={() => setShowReadyAlert(false)}
            className="ml-auto p-1 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowReadyAlert(false)}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReadyConfirm}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors font-medium"
          >
            Ready Up
          </button>
        </div>
      </div>
    </div>
  );